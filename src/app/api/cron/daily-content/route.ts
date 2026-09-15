import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateContent, generateTerm, ContentAgentError } from "@/lib/contentAgent";
import { validateDailyQuiz, DAILY_QUIZ_TOPIC } from "@/lib/dailyQuiz";
import { validateTerm } from "@/lib/termOfDay";
import { startOfUtcDay } from "@/lib/dateUtils";

// Vercel Cron hits this daily (vercel.json). Guarded by CRON_SECRET, same
// pattern as /api/cron/fetch-news. Generates today's 10-question quiz and
// today's term of the day, both on Ollama (see AGENT_COSTS.md for why
// that's the right tier for unreviewed-but-low-stakes daily content).
//
// Deliberately does NOT write anything if generation or validation fails
// — GET /api/quiz and GET /api/term-of-day both fall back to reviewed
// static content on their own read path, so a failed cron run degrades to
// "today looks like yesterday/the curated set," never to broken content.
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = startOfUtcDay();
  const result: { quiz: string; term: string } = { quiz: "skipped", term: "skipped" };

  try {
    const existingQuiz = await prisma.quizQuestion.count({ where: { quizDate: today } });
    if (existingQuiz === 0) {
      const generated = await generateContent("QUIZ", DAILY_QUIZ_TOPIC, "ollama");
      const valid = validateDailyQuiz(generated.content);
      if (valid) {
        await prisma.quizQuestion.createMany({
          data: valid.map((q, order) => ({ quizDate: today, order, source: "ollama", ...q })),
        });
        result.quiz = `generated ${valid.length}`;
      } else {
        result.quiz = "validation failed — falling back to curated set";
      }
    } else {
      result.quiz = "already generated today";
    }
  } catch (err) {
    result.quiz = `error: ${err instanceof ContentAgentError ? err.message : String(err)}`;
  }

  try {
    const existingTerm = await prisma.termOfDay.findUnique({ where: { date: today } });
    if (!existingTerm) {
      const recent = await prisma.termOfDay.findMany({
        orderBy: { date: "desc" },
        take: 30,
        select: { term: true },
      });
      const generated = await generateTerm(recent.map((t) => t.term), "ollama");
      const valid = validateTerm(generated.content);
      if (valid) {
        await prisma.termOfDay.create({ data: { date: today, source: "ollama", ...valid } });
        result.term = `generated "${valid.term}"`;
      } else {
        result.term = "validation failed — falling back to evergreen set";
      }
    } else {
      result.term = "already generated today";
    }
  } catch (err) {
    result.term = `error: ${err instanceof ContentAgentError ? err.message : String(err)}`;
  }

  return NextResponse.json(result);
}
