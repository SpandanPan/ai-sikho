import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { computeStreak } from "@/lib/streak";
import { courses } from "@/data/courses";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const [progressRows, quizAttempts, pageViews, mentorProfile, mentorBookings] = await Promise.all([
    prisma.courseProgress.findMany({ where: { userId } }),
    prisma.quizAttempt.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 10 }),
    prisma.analyticsEvent.findMany({
      where: { userId, type: "PAGE_VIEW" },
      orderBy: { createdAt: "desc" },
      select: { path: true, createdAt: true },
      take: 200, // enough history for a meaningful streak without scanning the whole table
    }),
    prisma.mentor.findUnique({ where: { userId }, select: { id: true } }),
    prisma.mentorBooking.findMany({
      where: { userId, status: "PAID", slot: { startTime: { gte: new Date() } } },
      include: { mentor: { select: { name: true } }, slot: true },
      orderBy: { slot: { startTime: "asc" } },
    }),
  ]);

  const progressBySlug = new Map(progressRows.map((p) => [p.courseSlug, p]));
  const courseStatus = courses.map((c) => {
    const p = progressBySlug.get(c.slug);
    return {
      slug: c.slug,
      title: c.title,
      percent: p?.percent ?? 0,
      status: !p || p.percent === 0 ? "not-started" : p.percent === 100 ? "completed" : "in-progress",
    };
  });

  const activeDays = [...new Set(pageViews.map((v) => v.createdAt.toISOString().slice(0, 10)))];
  const streak = computeStreak(activeDays);

  const recentlyViewed: { path: string; lastVisited: string }[] = [];
  const seen = new Set<string>();
  for (const v of pageViews) {
    if (seen.has(v.path)) continue;
    seen.add(v.path);
    recentlyViewed.push({ path: v.path, lastVisited: v.createdAt.toISOString() });
    if (recentlyViewed.length >= 8) break;
  }

  return NextResponse.json({
    streak,
    courses: courseStatus,
    quizAttempts: quizAttempts.map((a) => ({ score: a.score, total: a.total, createdAt: a.createdAt })),
    recentlyViewed,
    isMentor: Boolean(mentorProfile),
    mentorBookings: mentorBookings.map((b) => ({
      mentorName: b.mentor.name,
      startTime: b.slot.startTime,
      meetingJoinUrl: b.meetingJoinUrl,
    })),
  });
}
