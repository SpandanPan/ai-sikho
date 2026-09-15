import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { resolveCartItem, calculateCartSubtotal, distributeDiscount, type CartItemInput } from "@/lib/cart";
import { normalizeCouponCode, checkCoupon, calculateDiscountInPaise } from "@/lib/coupons";
import { createRazorpayOrder, isRazorpayConfigured } from "@/lib/razorpay";

// Turns a cart into one Razorpay order + one Purchase row per item (all
// sharing that order — see the schema comment on Purchase.razorpayOrderId).
// The coupon's redemption count is NOT incremented here — only once
// payment is actually confirmed, in the webhook — so an abandoned
// checkout never burns a redemption of a limited coupon.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const items = body?.items;
  const couponCode = body?.couponCode;

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  const resolved = (items as CartItemInput[]).map(resolveCartItem);
  if (resolved.some((r) => r === null)) {
    return NextResponse.json({ error: "One or more items in your cart are no longer available." }, { status: 400 });
  }
  const cart = resolved as NonNullable<(typeof resolved)[number]>[];

  let discounts = cart.map(() => 0);
  let couponRecord: { code: string } | null = null;
  if (typeof couponCode === "string" && couponCode.trim()) {
    const coupon = await prisma.coupon.findUnique({ where: { code: normalizeCouponCode(couponCode) } });
    if (!coupon) return NextResponse.json({ error: "That coupon code doesn't exist." }, { status: 400 });
    const check = checkCoupon(coupon);
    if (!check.valid) return NextResponse.json({ error: check.reason }, { status: 400 });
    const subtotal = calculateCartSubtotal(cart);
    const totalDiscount = calculateDiscountInPaise(subtotal, coupon.discountPercent);
    discounts = distributeDiscount(cart, totalDiscount);
    couponRecord = coupon;
  }

  const totalAmountInPaise = calculateCartSubtotal(cart) - discounts.reduce((a, b) => a + b, 0);
  if (totalAmountInPaise <= 0) {
    return NextResponse.json({ error: "That total isn't valid — check your cart." }, { status: 400 });
  }

  if (!isRazorpayConfigured()) {
    return NextResponse.json(
      { error: "Payment isn't wired up in this environment yet — Razorpay keys aren't set. See COSTS.md." },
      { status: 502 }
    );
  }

  let order;
  try {
    order = await createRazorpayOrder(totalAmountInPaise, `cart-${userId}-${Date.now()}`);
  } catch (err) {
    console.error("[checkout] Razorpay order creation failed:", err);
    return NextResponse.json({ error: "Couldn't start payment — try again shortly." }, { status: 502 });
  }

  const purchases = await prisma.$transaction(
    cart.map((item, i) =>
      prisma.purchase.create({
        data: {
          userId,
          product: item.product,
          courseSlug: item.courseSlug,
          packTrack: item.packTrack,
          amountInPaise: item.amountInPaise - discounts[i],
          discountInPaise: discounts[i],
          couponCode: couponRecord?.code ?? null,
          razorpayOrderId: order.id,
        },
      })
    )
  );

  return NextResponse.json({
    orderId: order.id,
    amountInPaise: totalAmountInPaise,
    keyId: process.env.RAZORPAY_KEY_ID ?? null,
    purchaseIds: purchases.map((p) => p.id),
  });
}
