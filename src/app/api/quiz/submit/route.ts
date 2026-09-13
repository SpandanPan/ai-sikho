import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Records a completed quiz attempt for funnel analytics (which score bands
// convert into pack buyers). Works for logged-out visitors too — userId is
// nullable, so the quiz never forces a login to get feedback.
export async function POST(req: Request) {
  const body = await req.json();
  const { score, total, answers } = body as {
    score: number;
    total: number;
    answers: unknown;
  };

  if (typeof score !== "number" || typeof total !== "number") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);

  const attempt = await prisma.quizAttempt.create({
    data: {
      userId: session?.user ? (session.user as { id?: string }).id ?? null : null,
      score,
      total,
      answers: answers ?? {},
    },
  });

  return NextResponse.json({ id: attempt.id });
}
