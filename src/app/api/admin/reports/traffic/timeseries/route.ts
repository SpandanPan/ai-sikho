import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { bucketByTime } from "@/lib/analytics";

// Admin-only, deliberately: traffic-by-date/hour is internal-only, never
// surfaced to a customer-facing page. ?granularity=hour|day (default day),
// ?days=N (default 14).
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const url = new URL(req.url);
  const granularity = url.searchParams.get("granularity") === "hour" ? "hour" : "day";
  const days = Number(url.searchParams.get("days") ?? "14") || 14;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const views = await prisma.analyticsEvent.findMany({
    where: { type: "PAGE_VIEW", createdAt: { gte: since } },
    select: { createdAt: true },
  });

  return NextResponse.json({ granularity, days, series: bucketByTime(views.map((v) => v.createdAt), granularity) });
}
