import { describe, expect, it } from "vitest";
import { calculatePlatformFee, summarizeLedger, summarizeLedgerByDay, paiseToRupees } from "./ledger";

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

describe("summarizeLedgerByDay", () => {
  it("groups revenue and costs by calendar day, netting them", () => {
    const points = summarizeLedgerByDay([
      { type: "REVENUE", amountInPaise: 10000, createdAt: new Date("2026-09-14T10:00:00Z") },
      { type: "EXPENSE", amountInPaise: 300, createdAt: new Date("2026-09-14T11:00:00Z") },
      { type: "PLATFORM_FEE", amountInPaise: 200, createdAt: new Date("2026-09-14T12:00:00Z") },
      { type: "REVENUE", amountInPaise: 5000, createdAt: new Date("2026-09-15T09:00:00Z") },
    ]);
    expect(points).toEqual([
      { date: "2026-09-14", revenueInPaise: 10000, costsInPaise: 500, netInPaise: 9500 },
      { date: "2026-09-15", revenueInPaise: 5000, costsInPaise: 0, netInPaise: 5000 },
    ]);
  });

  it("subtracts a refund from that day's revenue", () => {
    const points = summarizeLedgerByDay([
      { type: "REVENUE", amountInPaise: 10000, createdAt: new Date("2026-09-14T10:00:00Z") },
      { type: "REFUND", amountInPaise: 10000, createdAt: new Date("2026-09-14T15:00:00Z") },
    ]);
    expect(points).toEqual([{ date: "2026-09-14", revenueInPaise: 0, costsInPaise: 0, netInPaise: 0 }]);
  });

  it("returns days sorted chronologically regardless of input order", () => {
    const points = summarizeLedgerByDay([
      { type: "EXPENSE", amountInPaise: 100, createdAt: new Date("2026-09-16T00:00:00Z") },
      { type: "EXPENSE", amountInPaise: 100, createdAt: new Date("2026-09-14T00:00:00Z") },
    ]);
    expect(points.map((p) => p.date)).toEqual(["2026-09-14", "2026-09-16"]);
  });

  it("returns an empty array for no entries", () => {
    expect(summarizeLedgerByDay([])).toEqual([]);
  });
});

describe("paiseToRupees", () => {
  it("formats paise as a 2-decimal rupee string", () => {
    expect(paiseToRupees(99900)).toBe("999.00");
    expect(paiseToRupees(150)).toBe("1.50");
  });
});
