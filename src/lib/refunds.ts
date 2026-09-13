export const REFUND_WINDOW_DAYS = 7;

export type RefundCheckInput = {
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  createdAt: Date;
  contentAccessed?: boolean; // true once the buyer has downloaded/opened the content
};

export type RefundEligibility = { eligible: true } | { eligible: false; reason: string };

// The two checks the product asked for explicitly:
//   1. can't refund the same purchase twice (or a purchase that was never
//      actually paid)
//   2. can't refund outside the stated 7-day window (see /refund-policy)
// Course purchases also lose eligibility once actually started, matching
// the "if you haven't downloaded/accessed it" line in that same policy.
export function checkRefundEligibility(
  purchase: RefundCheckInput,
  now: Date = new Date()
): RefundEligibility {
  if (purchase.status === "REFUNDED") {
    return { eligible: false, reason: "This purchase has already been refunded." };
  }
  if (purchase.status !== "PAID") {
    return { eligible: false, reason: "Only a completed (paid) purchase can be refunded." };
  }

  const deadline = new Date(purchase.createdAt.getTime() + REFUND_WINDOW_DAYS * 24 * 60 * 60 * 1000);
  if (now > deadline) {
    return { eligible: false, reason: `The ${REFUND_WINDOW_DAYS}-day refund window has passed.` };
  }

  if (purchase.contentAccessed) {
    return { eligible: false, reason: "This purchase has already been downloaded or accessed." };
  }

  return { eligible: true };
}
