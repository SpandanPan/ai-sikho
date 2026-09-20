import { describe, expect, it, afterEach } from "vitest";
import { EMAIL_ADDRESSES, buildReceiptEmail, buildCourseWelcomeEmail, buildSupportAckEmail, buildOtpEmail } from "./email";

describe("EMAIL_ADDRESSES", () => {
  const original = process.env.EMAIL_DOMAIN;
  afterEach(() => {
    if (original === undefined) delete process.env.EMAIL_DOMAIN;
    else process.env.EMAIL_DOMAIN = original;
  });

  it("uses four distinct, purpose-separated local parts on the same domain", () => {
    expect(EMAIL_ADDRESSES.receipts).not.toBe(EMAIL_ADDRESSES.courses);
    expect(EMAIL_ADDRESSES.courses).not.toBe(EMAIL_ADDRESSES.support);
    expect(EMAIL_ADDRESSES.support).not.toBe(EMAIL_ADDRESSES.auth);
    const domain = EMAIL_ADDRESSES.receipts.split("@")[1];
    expect(EMAIL_ADDRESSES.courses.endsWith(`@${domain}`)).toBe(true);
    expect(EMAIL_ADDRESSES.support.endsWith(`@${domain}`)).toBe(true);
    expect(EMAIL_ADDRESSES.auth.endsWith(`@${domain}`)).toBe(true);
  });
});

describe("buildOtpEmail", () => {
  it("sends from the auth address and includes the code in both subject and body", () => {
    const email = buildOtpEmail({ to: "a@b.com", code: "482913" });
    expect(email.from).toBe(EMAIL_ADDRESSES.auth);
    expect(email.subject).toContain("482913");
    expect(email.html).toContain("482913");
  });

  it("mentions the 10-minute expiry so the recipient knows the code goes stale", () => {
    const email = buildOtpEmail({ to: "a@b.com", code: "111111" });
    expect(email.html).toMatch(/10 minutes/i);
  });
});

describe("buildReceiptEmail", () => {
  it("sends from the receipts address and includes the amount and invoice link", () => {
    const email = buildReceiptEmail({ to: "a@b.com", productLabel: "Interview Kit", amountInPaise: 99900, invoiceUrl: "https://x/invoice/1" });
    expect(email.from).toBe(EMAIL_ADDRESSES.receipts);
    expect(email.subject).toContain("999.00");
    expect(email.html).toContain("https://x/invoice/1");
  });
});

describe("buildCourseWelcomeEmail", () => {
  it("sends from the courses address, not receipts", () => {
    const email = buildCourseWelcomeEmail({ to: "a@b.com", courseTitle: "RAG Basics", courseUrl: "https://x/courses/rag-basics" });
    expect(email.from).toBe(EMAIL_ADDRESSES.courses);
    expect(email.subject).toContain("RAG Basics");
  });
});

describe("buildSupportAckEmail", () => {
  it("sends from the support address and greets the sender by name", () => {
    const email = buildSupportAckEmail({ to: "a@b.com", name: "Priya" });
    expect(email.from).toBe(EMAIL_ADDRESSES.support);
    expect(email.html).toContain("Priya");
  });
});
