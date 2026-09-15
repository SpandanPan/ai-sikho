import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { calculatePlatformFee } from "@/lib/ledger";
import { calculateGenerationCostInPaise } from "@/lib/agentPricing";
import { gradeAnswer, ContentAgentError } from "@/lib/contentAgent";
import { createZoomMeeting, isZoomConfigured } from "@/lib/zoom";
import { sendEmail, buildReceiptEmail, buildCourseWelcomeEmail } from "@/lib/email";
import { describeProduct } from "@/lib/invoice";
import { courses } from "@/data/courses";

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

    // A cart checkout creates one Purchase row per item, all sharing this
    // one order — findMany, not findUnique, and flip all of them together.
    // Idempotency: if this payment was already recorded (a retried
    // webhook), each purchase's status is already PAID — re-filtering on
    // status !== "PAID" before writing anything stops a retry from
    // double-counting revenue or double-sending receipt emails.
    const purchases = await prisma.purchase.findMany({
      where: { razorpayOrderId: payment.order_id, status: { not: "PAID" } },
      include: { user: true },
    });
    if (purchases.length > 0) {
      await prisma.$transaction(
        purchases.flatMap((purchase) => [
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
        ])
      );

      // Coupon redemption is counted here, on confirmed payment, not at
      // checkout — an abandoned checkout must never burn a redemption of
      // a limited coupon. Once per unique code actually used in this
      // batch, not once per Purchase row (a cart can have several rows
      // sharing one coupon).
      const couponCodes = [...new Set(purchases.map((p) => p.couponCode).filter((c): c is string => c !== null))];
      if (couponCodes.length > 0) {
        await prisma.coupon.updateMany({
          where: { code: { in: couponCodes } },
          data: { timesRedeemed: { increment: 1 } },
        });
      }

      // Emails are best-effort, after the money is safely recorded — a
      // failed send must never look like the payment itself failed.
      for (const purchase of purchases) {
        if (!purchase.user.email) continue;
        try {
          await sendEmail(
            buildReceiptEmail({
              to: purchase.user.email,
              productLabel: describeProduct(purchase),
              amountInPaise: purchase.amountInPaise,
              invoiceUrl: `${process.env.NEXTAUTH_URL ?? ""}/invoice/${purchase.id}`,
            })
          );
          if (purchase.product === "COURSE" && purchase.courseSlug) {
            const course = courses.find((c) => c.slug === purchase.courseSlug);
            if (course) {
              await sendEmail(
                buildCourseWelcomeEmail({
                  to: purchase.user.email,
                  courseTitle: course.title,
                  courseUrl: `${process.env.NEXTAUTH_URL ?? ""}/courses`,
                })
              );
            }
          }
        } catch (err) {
          console.error(`[email] failed for purchase ${purchase.id}:`, err);
        }
      }
    }

    const booking = await prisma.mentorBooking.findUnique({
      where: { razorpayOrderId: payment.order_id },
      include: { mentor: true, slot: true },
    });
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

      // Video link creation is separate from the payment transaction above
      // on purpose, same reasoning as the grading call below: it's the one
      // part of this flow that calls an external API and can genuinely
      // fail or run slow, and that must never look like the payment itself
      // failed (money was already collected either way).
      try {
        if (isZoomConfigured()) {
          const meeting = await createZoomMeeting(
            `Mentoring session — ${booking.mentor.name}`,
            booking.slot.startTime,
            booking.slot.durationMinutes
          );
          await prisma.mentorBooking.update({
            where: { id: booking.id },
            data: { meetingJoinUrl: meeting.joinUrl, meetingHostUrl: meeting.hostUrl, meetingProvider: "zoom-api" },
          });
        } else if (booking.mentor.personalMeetingUrl) {
          await prisma.mentorBooking.update({
            where: { id: booking.id },
            data: {
              meetingJoinUrl: booking.mentor.personalMeetingUrl,
              meetingHostUrl: booking.mentor.personalMeetingUrl,
              meetingProvider: "personal-link",
            },
          });
        }
      } catch (err) {
        console.error(`[zoom] meeting creation failed for booking ${booking.id}:`, err);
        if (booking.mentor.personalMeetingUrl) {
          await prisma.mentorBooking.update({
            where: { id: booking.id },
            data: {
              meetingJoinUrl: booking.mentor.personalMeetingUrl,
              meetingHostUrl: booking.mentor.personalMeetingUrl,
              meetingProvider: "personal-link",
            },
          });
        }
      }
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
