import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeCouponCode, checkCoupon, calculateDiscountInPaise } from "@/lib/coupons";

// Public — checking whether a code works shouldn't require signing in
// first. Validate-only: does NOT redeem/increment anything, since there's
// no live checkout flow yet to redeem against (see README's known gaps).
// A future checkout calls this to price the discount, then increments
// Coupon.timesRedeemed itself, atomically, at the point a purchase is
// actually created — the same "conditional update inside the purchase
// transaction" pattern as the mentor-slot booking race guard, not a
// separate step that could double-book a maxRedemptions coupon.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { code, amountInPaise } = body ?? {};

  if (typeof code !== "string" || !code.trim() || !Number.isInteger(amountInPaise) || amountInPaise < 0) {
    return NextResponse.json({ error: "code and a non-negative amountInPaise are required" }, { status: 400 });
  }

  const coupon = await prisma.coupon.findUnique({ where: { code: normalizeCouponCode(code) } });
  if (!coupon) {
    return NextResponse.json({ valid: false, error: "That coupon code doesn't exist." }, { status: 404 });
  }

  const check = checkCoupon(coupon);
  if (!check.valid) {
    return NextResponse.json({ valid: false, error: check.reason }, { status: 400 });
  }

  const discountInPaise = calculateDiscountInPaise(amountInPaise, coupon.discountPercent);
  return NextResponse.json({
    valid: true,
    discountPercent: coupon.discountPercent,
    discountInPaise,
    finalAmountInPaise: amountInPaise - discountInPaise,
  });
}
