import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Creates a PENDING submission at the fixed ₹149 price — grading only runs
// once payment is confirmed (see the razorpay webhook), so nobody gets
// paid feedback for free. No live checkout button wired up yet (same TODO
// as everywhere else money changes hands in this app) — razorpayOrderId
// stays null until that's built; for now this documents the shape the
// checkout flow needs to fill in.
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

  const submission = await prisma.mockAnswerSubmission.create({
    data: { userId, category, question, answerText },
  });

  return NextResponse.json({ submission });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const submissions = await prisma.mockAnswerSubmission.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ submissions });
}
