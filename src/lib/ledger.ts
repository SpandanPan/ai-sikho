// The CA report's actual math lives here, deliberately separated from the
// database query that fetches LedgerEntry rows — so the arithmetic is
// unit-testable without a database, and there's exactly one place that
// knows what "profit" means.
export const RAZORPAY_FEE_PERCENT = 2; // approximate — confirm your actual rate in the Razorpay dashboard, it varies by payment method

export function calculatePlatformFee(amountInPaise: number, feePercent: number = RAZORPAY_FEE_PERCENT): number {
  if (amountInPaise < 0) throw new Error("amountInPaise must not be negative");
  return Math.round((amountInPaise * feePercent) / 100);
}

export type LedgerEntryLike = {
  type: "REVENUE" | "REFUND" | "PLATFORM_FEE" | "EXPENSE";
  amountInPaise: number;
};

export type LedgerSummary = {
  revenueInPaise: number;
  refundsInPaise: number;
  platformFeesInPaise: number;
  expensesInPaise: number;
  netProfitInPaise: number;
};

// Every entry stores a positive magnitude; this is the one place that
// decides which types add to profit and which subtract.
export function summarizeLedger(entries: LedgerEntryLike[]): LedgerSummary {
  const summary: LedgerSummary = {
    revenueInPaise: 0,
    refundsInPaise: 0,
    platformFeesInPaise: 0,
    expensesInPaise: 0,
    netProfitInPaise: 0,
  };

  for (const e of entries) {
    if (e.amountInPaise < 0) throw new Error("LedgerEntry.amountInPaise must be a positive magnitude");
    switch (e.type) {
      case "REVENUE":
        summary.revenueInPaise += e.amountInPaise;
        break;
      case "REFUND":
        summary.refundsInPaise += e.amountInPaise;
        break;
      case "PLATFORM_FEE":
        summary.platformFeesInPaise += e.amountInPaise;
        break;
      case "EXPENSE":
        summary.expensesInPaise += e.amountInPaise;
        break;
    }
  }

  summary.netProfitInPaise =
    summary.revenueInPaise - summary.refundsInPaise - summary.platformFeesInPaise - summary.expensesInPaise;

  return summary;
}

export function paiseToRupees(paise: number): string {
  return (paise / 100).toFixed(2);
}
