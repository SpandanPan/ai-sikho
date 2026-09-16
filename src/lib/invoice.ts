import { courses } from "@/data/courses";
import { interviewPacks } from "@/data/interviewPacks";

// Real plumbing for invoice generation — deliberately produces a plain
// invoice with NO tax line by default, and only adds GST fields once
// GST_NUMBER is actually set in env. Charging or displaying GST without
// being registered is not just wrong, it's not allowed — see README's
// GST note for the registration threshold. This defaults to correct for
// the common early-stage case (not yet registered) rather than defaulting
// to "looks more official" by fabricating a tax line.
export function isGstRegistered(): boolean {
  return Boolean(process.env.GST_NUMBER);
}

// Shared by the invoice page and the receipt email — one place that knows
// how to turn a Purchase row into a human-readable line-item description.
export function describeProduct(purchase: { product: string; courseSlug: string | null; packTrack: string | null }): string {
  if (purchase.product === "COURSE") {
    return courses.find((c) => c.slug === purchase.courseSlug)?.title ?? "Course";
  }
  const pack = interviewPacks.find((p) => p.slug === purchase.packTrack);
  const packLabel = pack ? pack.title : "Interview Pack";
  return purchase.product === "STARTER_PACK" ? `${packLabel} — Starter Pack` : `${packLabel} — Interview Kit`;
}

export const DEFAULT_GST_RATE_PERCENT = 18; // standard rate for most services; override via GST_RATE_PERCENT if a different SAC applies

export function getGstRatePercent(): number {
  return Number(process.env.GST_RATE_PERCENT ?? DEFAULT_GST_RATE_PERCENT);
}

export function formatInvoiceNumber(n: number): string {
  return `INV-${String(n).padStart(6, "0")}`;
}

export type InvoiceLineItem = { description: string; amountInPaise: number };

export type InvoiceData = {
  invoiceNumber: string;
  date: Date;
  seller: { name: string; address: string; gstin: string | null };
  buyer: { name: string; email: string | null };
  lineItem: InvoiceLineItem;
  discountInPaise: number;
  subtotalInPaise: number; // lineItem - discount, before any tax
  gst: { ratePercent: number; amountInPaise: number } | null; // null when not GST-registered
  totalInPaise: number;
};

// totalInPaise (what the customer actually paid) is treated as
// GST-inclusive, the normal convention for consumer-facing pricing in
// India ("₹999, all in") — the tax amount shown is derived from it, not
// added on top. Does not split CGST+SGST vs IGST (that depends on buyer
// vs seller state, which isn't collected anywhere in this app today) —
// shown as one combined GST line, a real simplification to revisit with
// a CA once GST registration is actually real, not a guess to ship as-is
// forever.
export function buildInvoiceData(opts: {
  invoiceNumber: string;
  date: Date;
  buyerName: string;
  buyerEmail: string | null;
  description: string;
  totalPaidInPaise: number; // what was actually charged, after any coupon
  discountInPaise: number;
}): InvoiceData {
  const sellerName = process.env.BUSINESS_LEGAL_NAME ?? "AI Sikho";
  const sellerAddress = process.env.BUSINESS_ADDRESS ?? "";
  const gstin = process.env.GST_NUMBER ?? null;

  const gst = gstin
    ? (() => {
        const rate = getGstRatePercent();
        const taxableValue = Math.round((opts.totalPaidInPaise * 100) / (100 + rate));
        return { ratePercent: rate, amountInPaise: opts.totalPaidInPaise - taxableValue };
      })()
    : null;

  return {
    invoiceNumber: opts.invoiceNumber,
    date: opts.date,
    seller: { name: sellerName, address: sellerAddress, gstin },
    buyer: { name: opts.buyerName, email: opts.buyerEmail },
    lineItem: { description: opts.description, amountInPaise: opts.totalPaidInPaise + opts.discountInPaise },
    discountInPaise: opts.discountInPaise,
    subtotalInPaise: opts.totalPaidInPaise,
    gst,
    totalInPaise: opts.totalPaidInPaise,
  };
}
