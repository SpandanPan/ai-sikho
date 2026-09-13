import { describe, expect, it } from "vitest";
import { calculatePlatformFee, summarizeLedger, paiseToRupees } from "./ledger";

describe("calculatePlatformFee", () => {
  it("computes 2% by default", () => {
    expect(calculatePlatformFee(100000)).toBe(2000); // ₹1000 -> ₹20 fee
  });

  it("respects a custom fee percent", () => {
    expect(calculatePlatformFee(100000, 3)).toBe(3000);
  });

  it("rounds to the nearest paisa", () => {
    expect(calculatePlatformFee(9999, 2)).toBe(200); // 199.98 -> 200
  });

  it("rejects a negative amount", () => {
    expect(() => calculatePlatformFee(-1)).toThrow();
  });
});

describe("summarizeLedger", () => {
  it("nets revenue against fees, refunds, and expenses", () => {
    const summary = summarizeLedger([
      { type: "REVENUE", amountInPaise: 99900 }, // ₹999 course sale
      { type: "PLATFORM_FEE", amountInPaise: 1998 }, // ₹19.98 razorpay cut
      { type: "EXPENSE", amountInPaise: 500 }, // ₹5 AI generation cost
    ]);
    expect(summary.revenueInPaise).toBe(99900);
    expect(summary.platformFeesInPaise).toBe(1998);
    expect(summary.expensesInPaise).toBe(500);
    expect(summary.netProfitInPaise).toBe(99900 - 1998 - 500);
  });

  it("subtracts refunds from profit", () => {
    const summary = summarizeLedger([
      { type: "REVENUE", amountInPaise: 10000 },
      { type: "REFUND", amountInPaise: 10000 },
    ]);
    expect(summary.netProfitInPaise).toBe(0);
  });

  it("returns all zeros for an empty ledger", () => {
    const summary = summarizeLedger([]);
    expect(summary).toEqual({
      revenueInPaise: 0,
      refundsInPaise: 0,
      platformFeesInPaise: 0,
      expensesInPaise: 0,
      netProfitInPaise: 0,
    });
  });

  it("rejects a negative amount on any entry", () => {
    expect(() => summarizeLedger([{ type: "REVENUE", amountInPaise: -1 }])).toThrow();
  });
});

describe("paiseToRupees", () => {
  it("formats paise as a 2-decimal rupee string", () => {
    expect(paiseToRupees(99900)).toBe("999.00");
    expect(paiseToRupees(150)).toBe("1.50");
  });
});
