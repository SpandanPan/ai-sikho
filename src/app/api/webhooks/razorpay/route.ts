import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { calculatePlatformFee } from "@/lib/ledger";
import { calculateGenerationCostInPaise } from "@/lib/agentPricing";
import { gradeAnswer, ContentAgentError } from "@/lib/contentAgent";

// Razorpay calls this after a payment. Verify the signature before trusting
// anything in the body — otherwise anyone could POST a fake "paid" event
// and unlock the pack for free.
export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET ?? "")
    .update(rawBody)
    .digest("hex");

  if (expected !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;

    // Idempotency: if this payment was already recorded (a retried
    // webhook), the purchase's status is already PAID and this lookup by
    // orderId still finds it — updating it again to the same state, and
    // creating a second pair of ledger entries, would silently double-count
    // revenue. Guard on current status before writing anything.
    const purchase = await prisma.purchase.findUnique({ where: { razorpayOrderId: payment.order_id } });
    if (purchase && purchase.status !== "PAID") {
      await prisma.$transaction([
        prisma.purchase.update({
          where: { id: purchase.id },
          data: { status: "PAID", razorpayPaymentId: payment.id },
        }),
        prisma.ledgerEntry.create({
          data: {
            type: "REVENUE",
            amountInPaise: purchase.amountInPaise,
            category: purchase.product === "COURSE" ? "course_sale" : "kit_sale",
            description: `Purchase ${purchase.id}`,
            userId: purchase.userId,
            purchaseId: purchase.id,
          },
        }),
        prisma.ledgerEntry.create({
          data: {
            type: "PLATFORM_FEE",
            amountInPaise: calculatePlatformFee(purchase.amountInPaise),
            category: "razorpay_fee",
            description: `Razorpay fee on purchase ${purchase.id}`,
            userId: purchase.userId,
            purchaseId: purchase.id,
          },
        }),
      ]);
    }

    const booking = await prisma.mentorBooking.findUnique({ where: { razorpayOrderId: payment.order_id } });
    if (booking && booking.status !== "PAID") {
      await prisma.$transaction([
        prisma.mentorBooking.update({
          where: { id: booking.id },
          data: { status: "PAID", razorpayPaymentId: payment.id },
        }),
        prisma.ledgerEntry.create({
          data: {
            type: "REVENUE",
            amountInPaise: booking.amountInPaise,
            category: "mentor_session",
            description: `Mentor booking ${booking.id}`,
            userId: booking.userId,
          },
        }),
        prisma.ledgerEntry.create({
          data: {
            type: "PLATFORM_FEE",
            amountInPaise: calculatePlatformFee(booking.amountInPaise),
            category: "razorpay_fee",
            description: `Razorpay fee on mentor booking ${booking.id}`,
            userId: booking.userId,
          },
        }),
      ]);
    }

    // Grading only happens after payment — this is the paid feature, not a
    // free preview. Marking PAID and running the grading agent are separate
    // steps on purpose: the agent call is the one part of this handler that
    // can genuinely fail or run slow, and a failure there must never look
    // like the payment itself failed (money was already collected).
    const submission = await prisma.mockAnswerSubmission.findUnique({ where: { razorpayOrderId: payment.order_id } });
    if (submission && submission.status === "PENDING") {
      await prisma.$transaction([
        prisma.mockAnswerSubmission.update({
          where: { id: submission.id },
          data: { status: "PAID", razorpayPaymentId: payment.id },
        }),
        prisma.ledgerEntry.create({
          data: {
            type: "REVENUE",
            amountInPaise: submission.priceInPaise,
            category: "mock_feedback",
            description: `Mock answer feedback ${submission.id}`,
            userId: submission.userId,
          },
        }),
        prisma.ledgerEntry.create({
          data: {
            type: "PLATFORM_FEE",
            amountInPaise: calculatePlatformFee(submission.priceInPaise),
            category: "razorpay_fee",
            description: `Razorpay fee on mock feedback ${submission.id}`,
            userId: submission.userId,
          },
        }),
      ]);

      const provider = "anthropic" as const;
      try {
        const result = await gradeAnswer(submission.category, submission.question, submission.answerText, provider);
        const costInPaise = calculateGenerationCostInPaise(provider, result.inputTokens, result.outputTokens);
        await prisma.$transaction([
          prisma.mockAnswerSubmission.update({
            where: { id: submission.id },
            data: { status: "GRADED", provider, feedbackJson: result.content as object, costInPaise },
          }),
          prisma.ledgerEntry.create({
            data: {
              type: "EXPENSE",
              amountInPaise: costInPaise,
              category: "ai_generation",
              description: `Grading cost — mock feedback ${submission.id}`,
              userId: submission.userId,
            },
          }),
        ]);
      } catch (err) {
        const message = err instanceof ContentAgentError ? err.message : "Grading failed.";
        await prisma.mockAnswerSubmission.update({
          where: { id: submission.id },
          data: { status: "FAILED", errorMessage: message },
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
