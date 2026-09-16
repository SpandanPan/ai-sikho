// Policy: no refunds on any purchase — see /refund-policy. This file
// still exists (rather than being deleted) because two checks stay
// load-bearing even under "no refunds": a purchase can't be refunded
// twice, and only an actually-paid purchase can be refunded at all. Past
// that, an ordinary request is always ineligible.
//
// The one way past "ineligible" is an explicit overrideReason on the
// admin route — for the narrow cases a stated "no refunds" policy can't
// actually waive under Indian consumer law regardless of what the policy
// says (the service was never delivered, a duplicate or unauthorized
// charge), or a deliberate goodwill exception you choose to make. Every
// override is logged with its reason (see the admin refund route) —
// this is meant to be rare and auditable, not a second, quieter refund
// window.
export type RefundCheckInput = {
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
};

export type RefundEligibility = { eligible: true } | { eligible: false; reason: string };

export function checkRefundEligibility(purchase: RefundCheckInput, overrideReason?: string): RefundEligibility {
  if (purchase.status === "REFUNDED") {
    return { eligible: false, reason: "This purchase has already been refunded." };
  }
  if (purchase.status !== "PAID") {
    return { eligible: false, reason: "Only a completed (paid) purchase can be refunded." };
  }
  if (overrideReason && overrideReason.trim()) {
    return { eligible: true };
  }
  return {
    eligible: false,
    reason: "All sales are final — see /refund-policy. A refund can still be issued as an explicit admin exception (non-delivery, a duplicate charge, or goodwill).",
  };
}
