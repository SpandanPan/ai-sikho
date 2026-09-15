import { describe, expect, it, afterEach } from "vitest";
import { buildInvoiceData, formatInvoiceNumber, isGstRegistered, getGstRatePercent } from "./invoice";

describe("formatInvoiceNumber", () => {
  it("zero-pads to 6 digits", () => {
    expect(formatInvoiceNumber(1)).toBe("INV-000001");
    expect(formatInvoiceNumber(123456)).toBe("INV-123456");
  });
});

describe("isGstRegistered / buildInvoiceData", () => {
  const original = { GST_NUMBER: process.env.GST_NUMBER, GST_RATE_PERCENT: process.env.GST_RATE_PERCENT };
  afterEach(() => {
    process.env.GST_NUMBER = original.GST_NUMBER;
    process.env.GST_RATE_PERCENT = original.GST_RATE_PERCENT;
  });

  it("produces a plain invoice with no GST line when not registered", () => {
    delete process.env.GST_NUMBER;
    expect(isGstRegistered()).toBe(false);

    const invoice = buildInvoiceData({
      invoiceNumber: "INV-000001",
      date: new Date("2026-09-15"),
      buyerName: "Priya",
      buyerEmail: "priya@example.com",
      description: "Senior GenAI Engineer Interview Kit",
      totalPaidInPaise: 99900,
      discountInPaise: 0,
    });

    expect(invoice.gst).toBeNull();
    expect(invoice.totalInPaise).toBe(99900);
    expect(invoice.seller.gstin).toBeNull();
  });

  it("derives the GST-inclusive tax amount once a GST number is set", () => {
    process.env.GST_NUMBER = "27ABCDE1234F1Z5";
    process.env.GST_RATE_PERCENT = "18";
    expect(isGstRegistered()).toBe(true);
    expect(getGstRatePercent()).toBe(18);

    const invoice = buildInvoiceData({
      invoiceNumber: "INV-000002",
      date: new Date("2026-09-15"),
      buyerName: "Priya",
      buyerEmail: "priya@example.com",
      description: "Senior GenAI Engineer Interview Kit",
      totalPaidInPaise: 118000, // ₹1180 inclusive of 18% GST -> ₹1000 taxable + ₹180 GST
      discountInPaise: 0,
    });

    expect(invoice.gst).not.toBeNull();
    expect(invoice.gst!.ratePercent).toBe(18);
    expect(invoice.gst!.amountInPaise).toBe(18000);
    expect(invoice.seller.gstin).toBe("27ABCDE1234F1Z5");
  });

  it("adds the discount back into the pre-discount line item amount", () => {
    delete process.env.GST_NUMBER;
    const invoice = buildInvoiceData({
      invoiceNumber: "INV-000003",
      date: new Date("2026-09-15"),
      buyerName: "Priya",
      buyerEmail: null,
      description: "Starter Pack",
      totalPaidInPaise: 9000, // paid ₹90 after a ₹10 discount off ₹100
      discountInPaise: 1000,
    });

    expect(invoice.lineItem.amountInPaise).toBe(10000);
    expect(invoice.discountInPaise).toBe(1000);
    expect(invoice.subtotalInPaise).toBe(9000);
  });
});
