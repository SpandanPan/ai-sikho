import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { checkRefundEligibility } from "@/lib/refunds";

// Read-only eligibility check — lets an admin (or a future self-service
// refund-request UI) see whether a purchase currently qualifies, without
// actually refunding it.
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const purchase = await prisma.purchase.findUnique({ where: { id: params.id } });
  if (!purchase) return NextResponse.json({ error: "Purchase not found" }, { status: 404 });

  return NextResponse.json(checkRefundEligibility(purchase));
}

// Refunds are admin-triggered (the refund policy tells buyers to email
// support), not self-service — this is the check-then-act step once you've
// read that email. Enforces both things asked for explicitly: a purchase
// can't be refunded twice, and it can't be refunded outside the stated
// window (src/lib/refunds.ts holds the actual rule, unit-tested).
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const purchase = await prisma.purchase.findUnique({ where: { id: params.id } });
  if (!purchase) return NextResponse.json({ error: "Purchase not found" }, { status: 404 });

  const eligibility = checkRefundEligibility(purchase);
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
        description: `Refund for purchase ${purchase.id}`,
        userId: purchase.userId,
        purchaseId: purchase.id,
      },
    }),
  ]);

  return NextResponse.json({ purchase: updated });
}
