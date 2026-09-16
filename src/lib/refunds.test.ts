import { describe, expect, it } from "vitest";
import { checkRefundEligibility } from "./refunds";

describe("checkRefundEligibility", () => {
  it("rejects an ordinary request for a paid purchase — no refunds by default", () => {
    const result = checkRefundEligibility({ status: "PAID" });
    expect(result.eligible).toBe(false);
  });

  it("rejects a purchase that was already refunded — no double refunds, even with an override", () => {
    const result = checkRefundEligibility({ status: "REFUNDED" }, "duplicate charge");
    expect(result.eligible).toBe(false);
  });

  it("rejects a purchase that was never actually paid, even with an override", () => {
    expect(checkRefundEligibility({ status: "PENDING" }, "goodwill").eligible).toBe(false);
    expect(checkRefundEligibility({ status: "FAILED" }, "goodwill").eligible).toBe(false);
  });

  it("allows a paid purchase only when an explicit override reason is given", () => {
    expect(checkRefundEligibility({ status: "PAID" }, "service was never delivered")).toEqual({ eligible: true });
  });

  it("treats a blank/whitespace-only override the same as no override", () => {
    expect(checkRefundEligibility({ status: "PAID" }, "   ").eligible).toBe(false);
  });
});
