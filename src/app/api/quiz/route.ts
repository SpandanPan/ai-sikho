import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { quizQuestions as curated } from "@/data/quizQuestions";
import { startOfUtcDay } from "@/lib/dateUtils";

// force-dynamic — see the comment on /api/news for why this matters: a
// route with no dynamic segment and no auth otherwise gets statically
// frozen at build time, which would be exactly backwards for something
// meant to change every day.
export const dynamic = "force-dynamic";

// Serves today's 10 AI-generated questions if a full, valid set exists;
// falls back to the hand-curated set otherwise (cron hasn't run yet
// today, generation failed validation, or the DB itself is unreachable).
// `source` in the response tells the client which one it got — same
// transparency habit as the mock-feedback model labeling.
export async function GET() {
  try {
    const today = startOfUtcDay();
    const rows = await prisma.quizQuestion.findMany({
      where: { quizDate: today, active: true },
      orderBy: { order: "asc" },
    });
    if (rows.length === 10) {
      return NextResponse.json({
        questions: rows.map((r) => ({
          id: r.id,
          question: r.question,
          options: r.options,
          correctIdx: r.correctIdx,
          explanation: r.explanation,
        })),
        source: rows[0].source,
      });
    }
  } catch {
    // DB unreachable — fall through to the curated set below.
  }

  return NextResponse.json({
    questions: curated.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      correctIdx: q.correctIdx,
      explanation: q.explanation,
    })),
    source: "curated",
  });
}
