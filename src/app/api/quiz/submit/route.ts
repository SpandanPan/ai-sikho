import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Records a completed quiz attempt for funnel analytics (which score bands
// convert into pack buyers). Works for logged-out visitors too — userId is
// nullable, so the quiz never forces a login to get feedback.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const score = body?.score;
  const total = body?.total;
  const answers = body?.answers;

  if (typeof score !== "number" || typeof total !== "number" || total <= 0 || score < 0 || score > total) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
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
  } catch {
    // Analytics-only write — a DB hiccup here shouldn't look like the quiz
    // itself failed. The client already ignores this response either way.
    return NextResponse.json({ error: "Could not record attempt" }, { status: 500 });
  }
}
