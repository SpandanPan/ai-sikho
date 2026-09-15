// Real plumbing, NOT wired to a live provider — same honest TODO pattern
// as OTP delivery (src/app/api/auth/otp/request). Until RESEND_API_KEY is
// set, every send is logged server-side instead of actually delivered, so
// nothing here silently pretends to work.
//
// Three sender identities, one domain, purpose-separated so a receipt
// (transactional, must-deliver) never comes from the same address as a
// support reply (conversational) or a course welcome (marketing-adjacent)
// — mixing them hurts deliverability of the one that actually matters
// most (receipts) if any of the others gets flagged as spam.
const domain = process.env.EMAIL_DOMAIN ?? "example.com";

export const EMAIL_ADDRESSES = {
  receipts: `receipts@${domain}`,
  courses: `courses@${domain}`, // "welcome to the course" and similar enrollment messages
  support: `support@${domain}`,
};

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export type EmailMessage = { from: string; to: string; subject: string; html: string };

export async function sendEmail(message: EmailMessage): Promise<{ sent: boolean }> {
  if (!isEmailConfigured()) {
    console.log(`[email] NOT SENT (no RESEND_API_KEY) — from ${message.from} to ${message.to}: ${message.subject}`);
    return { sent: false };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(`[email] Resend API error ${res.status}: ${body.slice(0, 300)}`);
    return { sent: false };
  }
  return { sent: true };
}

// ---- Templates -----------------------------------------------------------
// Plain functions, no I/O, so the actual content is testable without
// mocking a network call.

export function buildReceiptEmail(opts: {
  to: string;
  productLabel: string; // e.g. "Senior GenAI Engineer Interview Kit"
  amountInPaise: number;
  invoiceUrl: string;
}): EmailMessage {
  const rupees = (opts.amountInPaise / 100).toFixed(2);
  return {
    from: EMAIL_ADDRESSES.receipts,
    to: opts.to,
    subject: `Receipt: ${opts.productLabel} — ₹${rupees}`,
    html: `<p>Thanks for your purchase — <b>${opts.productLabel}</b> for <b>₹${rupees}</b>.</p>
<p><a href="${opts.invoiceUrl}">View or print your invoice →</a></p>`,
  };
}

export function buildCourseWelcomeEmail(opts: { to: string; courseTitle: string; courseUrl: string }): EmailMessage {
  return {
    from: EMAIL_ADDRESSES.courses,
    to: opts.to,
    subject: `Welcome to ${opts.courseTitle}`,
    html: `<p>You're in — <b>${opts.courseTitle}</b> is ready whenever you are.</p>
<p><a href="${opts.courseUrl}">Start the course →</a></p>`,
  };
}

export function buildSupportAckEmail(opts: { to: string; name: string }): EmailMessage {
  return {
    from: EMAIL_ADDRESSES.support,
    to: opts.to,
    subject: "We got your message",
    html: `<p>Hi ${opts.name}, thanks for reaching out — we'll reply to this email address soon.</p>`,
  };
}
