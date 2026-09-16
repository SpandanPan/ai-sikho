import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { checkRefundEligibility } from "@/lib/refunds";

// Read-only eligibility check — for an ordinary purchase this always
// reports ineligible (policy: no refunds, see /refund-policy). Doesn't
// accept an override reason itself; this is "what would happen with no
// exception," not a way to preview one.
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const purchase = await prisma.purchase.findUnique({ where: { id: params.id } });
  if (!purchase) return NextResponse.json({ error: "Purchase not found" }, { status: 404 });

  return NextResponse.json(checkRefundEligibility(purchase));
}

// Refunding at all now requires an explicit overrideReason in the body —
// there's no more "within the window" self-service case, only the narrow
// exceptions a "no refunds" policy can't actually waive under Indian
// consumer law (non-delivery, a duplicate/unauthorized charge) or a
// deliberate goodwill call you're making. The reason is stored on the
// ledger entry itself, so every override is auditable after the fact —
// this is meant to be rare, not a quieter second refund window.
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const overrideReason = typeof body?.overrideReason === "string" ? body.overrideReason.trim() : "";
  if (!overrideReason) {
    return NextResponse.json(
      { error: "overrideReason is required — policy is no refunds; state why this is an exception." },
      { status: 400 }
    );
  }

  const purchase = await prisma.purchase.findUnique({ where: { id: params.id } });
  if (!purchase) return NextResponse.json({ error: "Purchase not found" }, { status: 404 });

  const eligibility = checkRefundEligibility(purchase, overrideReason);
  if (!eligibility.eligible) {
    return NextResponse.json({ error: eligibility.reason }, { status: 409 });
  }

  // TODO before real payments: call Razorpay's refund API here
  // (razorpay.payments.refund(purchase.razorpayPaymentId, ...)) before
  // marking this REFUNDED — right now this only updates our own record.
  const [updated] = await prisma.$transaction([
    prisma.purchase.update({
      where: { id: purchase.id },
      data: { status: "REFUNDED", refundedAt: new Date() },
    }),
    prisma.ledgerEntry.create({
      data: {
        type: "REFUND",
        amountInPaise: purchase.amountInPaise,
        category: "refund",
        description: `Refund for purchase ${purchase.id} — admin exception: ${overrideReason}`,
        userId: purchase.userId,
        purchaseId: purchase.id,
      },
    }),
  ]);

  return NextResponse.json({ purchase: updated });
}
