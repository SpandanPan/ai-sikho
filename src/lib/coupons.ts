export const MAX_COUPON_DISCOUNT_PERCENT = 10;

// Enforced here, not just at the point a coupon happens to get created —
// so it's impossible to end up with an over-10% coupon no matter which
// code path creates one.
export function isValidDiscountPercent(percent: number): boolean {
  return Number.isInteger(percent) && percent >= 1 && percent <= MAX_COUPON_DISCOUNT_PERCENT;
}

export function normalizeCouponCode(code: string): string {
  return code.trim().toUpperCase();
}

export function calculateDiscountInPaise(amountInPaise: number, discountPercent: number): number {
  if (amountInPaise < 0) throw new Error("amountInPaise must not be negative");
  if (!isValidDiscountPercent(discountPercent)) {
    throw new Error(`discountPercent must be an integer between 1 and ${MAX_COUPON_DISCOUNT_PERCENT}`);
  }
  return Math.round((amountInPaise * discountPercent) / 100);
}

export type CouponLike = {
  active: boolean;
  discountPercent: number;
  maxRedemptions: number | null;
  timesRedeemed: number;
  expiresAt: Date | null;
};

export type CouponCheck = { valid: true } | { valid: false; reason: string };

// Pure eligibility check — the caller (the API route) still owns the
// actual redemption-count increment, and should do it atomically inside
// the same transaction that creates the purchase, the same "conditional
// update, not read-then-write" pattern as the mentor-slot booking race
// guard, so two people can't both win the last redemption of a
// maxRedemptions coupon.
export function checkCoupon(coupon: CouponLike, now: Date = new Date()): CouponCheck {
  if (!coupon.active) return { valid: false, reason: "This coupon is no longer active." };
  if (coupon.expiresAt && coupon.expiresAt.getTime() < now.getTime()) {
    return { valid: false, reason: "This coupon has expired." };
  }
  if (coupon.maxRedemptions !== null && coupon.timesRedeemed >= coupon.maxRedemptions) {
    return { valid: false, reason: "This coupon has already been fully redeemed." };
  }
  return { valid: true };
}
