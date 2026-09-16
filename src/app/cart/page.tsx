"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useCart } from "@/components/CartContext";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function inr(paise: number) {
  return `₹${(paise / 100).toFixed(2)}`;
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CartPage() {
  const { status, data: session } = useSession();
  const { items, remove, clear } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState<{ code: string; discountPercent: number; discountInPaise: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = items.reduce((sum, i) => sum + i.amountInPaise, 0);
  const total = coupon ? subtotal - coupon.discountInPaise : subtotal;

  async function applyCoupon() {
    setCouponError(null);
    setCoupon(null);
    if (!couponCode.trim()) return;
    const res = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: couponCode, amountInPaise: subtotal }),
    });
    const data = await res.json();
    if (!res.ok || !data.valid) {
      setCouponError(data.error ?? "That coupon isn't valid.");
      return;
    }
    setCoupon({ code: couponCode.trim().toUpperCase(), discountPercent: data.discountPercent, discountInPaise: data.discountInPaise });
  }

  async function checkout() {
    setError(null);
    if (status !== "authenticated") {
      window.location.href = "/signin?callbackUrl=/cart";
      return;
    }
    setCheckingOut(true);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({ type: i.type, slug: i.slug })),
        couponCode: coupon?.code,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Couldn't start checkout.");
      setCheckingOut(false);
      return;
    }

    const loaded = await loadRazorpayScript();
    setCheckingOut(false);
    if (!loaded || !window.Razorpay) {
      setError("Couldn't load the payment form — check your connection and try again.");
      return;
    }

    const razorpay = new window.Razorpay({
      key: data.keyId,
      amount: data.amountInPaise,
      currency: "INR",
      order_id: data.orderId,
      name: "AI Sikho",
      prefill: { email: session?.user?.email ?? undefined },
      handler: () => {
        // Success here only means Razorpay reported it client-side — the
        // webhook is the actual source of truth, so this deliberately
        // doesn't claim "paid" yet, just that it's on its way.
        clear();
        window.location.href = "/profile";
      },
    });
    razorpay.open();
  }

  return (
    <main className="mx-auto max-w-xl px-5 py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-2">Cart</p>
      <h1 className="font-display text-2xl font-semibold mb-8">Your cart</h1>

      {items.length === 0 ? (
        <p className="text-sm text-ink-soft">
          Nothing here yet — add a Starter Pack, Interview Kit, or course to get started.
        </p>
      ) : (
        <>
          <div className="flex flex-col gap-2 mb-6">
            {items.map((item) => (
              <div key={item.key} className="flex items-center justify-between border border-paper-line rounded px-4 py-3">
                <span className="text-sm">{item.label}</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-accent-ink">{inr(item.amountInPaise)}</span>
                  <button onClick={() => remove(item.key)} className="font-mono text-[10.5px] text-rust underline">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border border-paper-line rounded p-4 mb-6">
            <div className="flex gap-2 mb-2">
              <input
                placeholder="Coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 border border-paper-line rounded px-3 py-2 text-sm bg-paper"
              />
              <button onClick={applyCoupon} className="font-mono text-xs border border-paper-line rounded px-3 py-2">
                Apply
              </button>
            </div>
            {couponError && <p className="text-xs text-rust">{couponError}</p>}
            {coupon && (
              <p className="text-xs text-accent2">
                {coupon.code} applied — {coupon.discountPercent}% off ({inr(coupon.discountInPaise)})
              </p>
            )}
          </div>

          <div className="flex justify-between items-baseline mb-6">
            <span className="text-sm text-ink-soft">Total</span>
            <span className="font-display text-2xl text-accent-ink">{inr(total)}</span>
          </div>

          {error && <p className="text-sm text-rust mb-4">{error}</p>}

          <button
            onClick={checkout}
            disabled={checkingOut}
            className="font-mono text-sm bg-ink text-paper rounded px-4 py-2.5 disabled:opacity-50"
          >
            {checkingOut ? "Starting checkout…" : "Checkout →"}
          </button>
          <p className="text-[10.5px] text-ink-soft mt-2">
            All sales are final — see <a href="/refund-policy" className="underline">the refund policy</a>.
          </p>
        </>
      )}
    </main>
  );
}
