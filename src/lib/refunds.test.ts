import { describe, expect, it } from "vitest";
import { checkRefundEligibility, REFUND_WINDOW_DAYS } from "./refunds";

const now = new Date("2026-09-13T12:00:00Z");
const daysAgo = (d: number) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000);

describe("checkRefundEligibility", () => {
  it("allows a paid, unaccessed, recent purchase", () => {
    expect(checkRefundEligibility({ status: "PAID", createdAt: daysAgo(1) }, now)).toEqual({ eligible: true });
  });

  it("rejects a purchase that was already refunded — no double refunds", () => {
    const result = checkRefundEligibility({ status: "REFUNDED", createdAt: daysAgo(1) }, now);
    expect(result.eligible).toBe(false);
  });

  it("rejects a purchase that was never actually paid", () => {
    expect(checkRefundEligibility({ status: "PENDING", createdAt: daysAgo(1) }, now).eligible).toBe(false);
    expect(checkRefundEligibility({ status: "FAILED", createdAt: daysAgo(1) }, now).eligible).toBe(false);
  });

  it(`allows a purchase right up to the ${REFUND_WINDOW_DAYS}-day boundary`, () => {
    const boundary = new Date(now.getTime() - REFUND_WINDOW_DAYS * 24 * 60 * 60 * 1000);
    expect(checkRefundEligibility({ status: "PAID", createdAt: boundary }, now).eligible).toBe(true);
  });

  it(`rejects a purchase one second past the ${REFUND_WINDOW_DAYS}-day window`, () => {
    const justPast = new Date(now.getTime() - REFUND_WINDOW_DAYS * 24 * 60 * 60 * 1000 - 1000);
    expect(checkRefundEligibility({ status: "PAID", createdAt: justPast }, now).eligible).toBe(false);
  });

  it("rejects a purchase whose content has already been accessed", () => {
    const result = checkRefundEligibility({ status: "PAID", createdAt: daysAgo(1), contentAccessed: true }, now);
    expect(result.eligible).toBe(false);
  });
});
