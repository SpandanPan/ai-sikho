import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// force-dynamic: without it, Next.js statically prerenders this route at
// build time and serves that one frozen response to every request in
// production forever after — the entire point of the hourly cron
// (vercel.json) would be silently defeated. This was a real, live bug
// here and on /api/mentors, not a theoretical one; caught while building
// the analogous /api/quiz route.
export const dynamic = "force-dynamic";

// Reads whatever scripts/fetch-news.ts last wrote to Postgres. If the table
// is empty (fresh install, cron hasn't run yet), returns [] and the client
// falls back to the sample cards — never a broken page.
export async function GET() {
  try {
    const items = await prisma.newsItem.findMany({
      orderBy: { publishedAt: "desc" },
      take: 20,
    });
    return NextResponse.json({ items });
  } catch {
    // DB not configured yet (fresh checkout, no DATABASE_URL) — let the
    // client fall back to sample cards instead of a broken page.
    return NextResponse.json({ items: [] });
  }
}
