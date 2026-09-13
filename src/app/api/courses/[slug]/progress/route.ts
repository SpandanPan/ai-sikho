import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isValidPercent } from "@/lib/courseTracking";

// Progress tracking is a signed-in feature on every course, free or paid —
// it's per-user state, so there's nothing meaningful to show an anonymous
// visitor. Client-side UI hides this behind a "sign in to track" prompt,
// but the real gate is here: no session, no read or write.
export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const progress = await prisma.courseProgress.findUnique({
    where: { userId_courseSlug: { userId, courseSlug: params.slug } },
  });

  return NextResponse.json({ percent: progress?.percent ?? 0 });
}

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!isValidPercent(body?.percent)) {
    return NextResponse.json({ error: "percent must be an integer 0-100" }, { status: 400 });
  }

  const progress = await prisma.courseProgress.upsert({
    where: { userId_courseSlug: { userId, courseSlug: params.slug } },
    update: { percent: body.percent, completedAt: body.percent === 100 ? new Date() : null },
    create: { userId, courseSlug: params.slug, percent: body.percent, completedAt: body.percent === 100 ? new Date() : null },
  });

  return NextResponse.json({ percent: progress.percent });
}
