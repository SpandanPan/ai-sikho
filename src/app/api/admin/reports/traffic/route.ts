import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { summarizeTraffic } from "@/lib/analytics";

// ?days=30 (default) — how far back to look.
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const days = Number(new URL(req.url).searchParams.get("days") ?? "30") || 30;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const events = await prisma.analyticsEvent.findMany({
    where: { createdAt: { gte: since } },
    select: { type: true, path: true, anonId: true, label: true, valueMs: true },
  });

  return NextResponse.json({ days, ...summarizeTraffic(events) });
}
