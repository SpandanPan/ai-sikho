import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { gradeAnswer, ContentAgentError } from "@/lib/contentAgent";
import { calculateGenerationCostInPaise } from "@/lib/agentPricing";
import { hasFreeAttemptRemaining, startOfMonth } from "@/lib/mockFeedbackQuota";

// The one agent in this app that's actually triggered live by a user click
// rather than by an admin or a payment webhook: sign in, write an answer,
// press "Grade it free," and gradeAnswer() runs against the self-hosted
// Ollama model right inside this request — no payment step, no polling.
//
// Only safe to point at Ollama because grading is the one place quality
// bar matters (see AGENT_COSTS.md's model-choice rule) — this is
// deliberately the FREE tier specifically so a weaker free model is an
// acceptable trade, not a compromise on the ₹149 paid product below it.
//
// Real constraint, not simulated: this only works where OLLAMA_BASE_URL is
// actually reachable. Locally (this is exactly how it was verified during
// this build) that's automatic. From the deployed Vercel site, it needs
// Ollama exposed at a real public address — see AGENT_COSTS.md.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const { category, question, answerText } = body ?? {};

  if (
    typeof category !== "string" || !category.trim() ||
    typeof question !== "string" || !question.trim() ||
    typeof answerText !== "string" || answerText.trim().length < 20
  ) {
    return NextResponse.json({ error: "category, question, and a real answer (20+ chars) are required" }, { status: 400 });
  }

  const usedThisMonth = await prisma.mockAnswerSubmission.findMany({
    where: { userId, isFree: true, createdAt: { gte: startOfMonth() } },
    select: { createdAt: true },
  });
  if (!hasFreeAttemptRemaining(usedThisMonth.map((s) => s.createdAt))) {
    return NextResponse.json(
      { error: "You've used this month's free feedback. The paid option (₹149) is unlimited." },
      { status: 429 }
    );
  }

  const submission = await prisma.mockAnswerSubmission.create({
    data: { userId, category, question, answerText, isFree: true, priceInPaise: 0 },
  });

  try {
    const result = await gradeAnswer(category, question, answerText, "ollama");
    const costInPaise = calculateGenerationCostInPaise("ollama", result.inputTokens, result.outputTokens); // always 0 — see agentPricing.ts

    const [updated] = await prisma.$transaction([
      prisma.mockAnswerSubmission.update({
        where: { id: submission.id },
        data: { status: "GRADED", provider: "ollama", feedbackJson: result.content as object, costInPaise },
      }),
      prisma.ledgerEntry.create({
        data: {
          type: "EXPENSE",
          amountInPaise: costInPaise,
          category: "ai_generation",
          description: `Free mock feedback (ollama) ${submission.id}`,
          userId,
        },
      }),
    ]);

    return NextResponse.json({ submission: updated });
  } catch (err) {
    const message =
      err instanceof ContentAgentError
        ? `Free feedback is temporarily unavailable (${err.message}). Try again later, or use the paid option.`
        : "Grading failed. Try again later, or use the paid option.";
    const updated = await prisma.mockAnswerSubmission.update({
      where: { id: submission.id },
      data: { status: "FAILED", errorMessage: message },
    });
    return NextResponse.json({ submission: updated, error: message }, { status: 502 });
  }
}
