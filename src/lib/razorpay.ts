// Real plumbing against Razorpay's documented Orders API — NOT wired up
// in this environment (no live RAZORPAY_KEY_ID/SECRET, same situation as
// every other external API in this codebase without a key). Creates the
// order the client's Razorpay Checkout.js modal actually opens; the
// webhook (src/app/api/webhooks/razorpay) is still the source of truth
// for whether it was actually paid — this function only starts the
// payment, it doesn't confirm one.
export type RazorpayOrder = { id: string; amount: number; currency: string };

export function isRazorpayConfigured(): boolean {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

export async function createRazorpayOrder(amountInPaise: number, receipt: string): Promise<RazorpayOrder> {
  if (!isRazorpayConfigured()) throw new Error("Razorpay is not configured (RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET).");

  const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64");
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify({ amount: amountInPaise, currency: "INR", receipt }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Razorpay order creation failed (${res.status}): ${body.slice(0, 300)}`);
  }
  return res.json();
}
