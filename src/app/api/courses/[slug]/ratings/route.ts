import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isValidRating } from "@/lib/courseTracking";

// Public read (the average is social proof shown to everyone), gated write
// (rating requires a real, signed-in user — one rating per person per
// course, upserted rather than duplicated).
export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const [agg, session] = await Promise.all([
    prisma.courseRating.aggregate({
      where: { courseSlug: params.slug },
      _avg: { rating: true },
      _count: { rating: true },
    }),
    getServerSession(authOptions),
  ]);

  const userId = (session?.user as { id?: string } | undefined)?.id;
  const mine = userId
    ? await prisma.courseRating.findUnique({
        where: { userId_courseSlug: { userId, courseSlug: params.slug } },
      })
    : null;

  return NextResponse.json({
    average: agg._avg.rating ?? 0,
    count: agg._count.rating,
    myRating: mine?.rating ?? null,
  });
}

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!isValidRating(body?.rating)) {
    return NextResponse.json({ error: "rating must be an integer 1-5" }, { status: 400 });
  }

  await prisma.courseRating.upsert({
    where: { userId_courseSlug: { userId, courseSlug: params.slug } },
    update: { rating: body.rating, comment: body.comment ?? null },
    create: { userId, courseSlug: params.slug, rating: body.rating, comment: body.comment ?? null },
  });

  return NextResponse.json({ ok: true });
}
