import { describe, expect, it } from "vitest";
import {
  isValidDiscountPercent,
  normalizeCouponCode,
  calculateDiscountInPaise,
  checkCoupon,
  MAX_COUPON_DISCOUNT_PERCENT,
} from "./coupons";

describe("isValidDiscountPercent", () => {
  it("accepts 1 through the max", () => {
    expect(isValidDiscountPercent(1)).toBe(true);
    expect(isValidDiscountPercent(MAX_COUPON_DISCOUNT_PERCENT)).toBe(true);
  });

  it("rejects anything above the 10% cap", () => {
    expect(isValidDiscountPercent(11)).toBe(false);
    expect(isValidDiscountPercent(50)).toBe(false);
  });

  it("rejects zero, negative, and non-integer values", () => {
    expect(isValidDiscountPercent(0)).toBe(false);
    expect(isValidDiscountPercent(-5)).toBe(false);
    expect(isValidDiscountPercent(5.5)).toBe(false);
  });
});

describe("normalizeCouponCode", () => {
  it("upper-cases and trims", () => {
    expect(normalizeCouponCode("  launch10 ")).toBe("LAUNCH10");
  });
});

describe("calculateDiscountInPaise", () => {
  it("computes a percentage discount, rounded", () => {
    expect(calculateDiscountInPaise(99900, 10)).toBe(9990); // 10% of ₹999
  });

  it("throws on a discount above the 10% cap, even if asked to compute it", () => {
    expect(() => calculateDiscountInPaise(10000, 20)).toThrow();
  });

  it("throws on a negative amount", () => {
    expect(() => calculateDiscountInPaise(-100, 10)).toThrow();
  });
});

describe("checkCoupon", () => {
  const base = { active: true, discountPercent: 10, maxRedemptions: null, timesRedeemed: 0, expiresAt: null };

  it("is valid when active, unexpired, and under any redemption cap", () => {
    expect(checkCoupon(base)).toEqual({ valid: true });
  });

  it("rejects an inactive coupon", () => {
    expect(checkCoupon({ ...base, active: false })).toEqual({ valid: false, reason: "This coupon is no longer active." });
  });

  it("rejects an expired coupon", () => {
    const result = checkCoupon({ ...base, expiresAt: new Date("2020-01-01") });
    expect(result.valid).toBe(false);
  });

  it("accepts a coupon expiring in the future", () => {
    const result = checkCoupon({ ...base, expiresAt: new Date("2099-01-01") });
    expect(result.valid).toBe(true);
  });

  it("rejects a coupon that hit its redemption cap", () => {
    const result = checkCoupon({ ...base, maxRedemptions: 5, timesRedeemed: 5 });
    expect(result.valid).toBe(false);
  });

  it("accepts a coupon under its redemption cap", () => {
    const result = checkCoupon({ ...base, maxRedemptions: 5, timesRedeemed: 4 });
    expect(result.valid).toBe(true);
  });
});
