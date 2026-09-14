import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isEmail, normalizeIdentifier } from "@/lib/otp";
import { checkIpRateLimit } from "@/lib/rateLimit";

// Public, unauthenticated — signing up for the newsletter shouldn't require
// an account. Upserts on email so re-submitting (or re-subscribing after
// having unsubscribed) never errors, it just clears unsubscribedAt.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const raw = body?.email;
  const source = typeof body?.source === "string" ? body.source.slice(0, 100) : null;

  if (typeof raw !== "string" || !isEmail(raw.trim())) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  const email = normalizeIdentifier(raw);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  if (ip) {
    // No per-signup ip column here (this table has no abuse surface worth
    // the extra column — worst case of spam is duplicate emails, which the
    // unique constraint already absorbs) — a coarse global-recent-signups
    // check is enough to slow down a scripted flood.
    const since = new Date(Date.now() - 15 * 60 * 1000);
    const recent = await prisma.newsletterSubscriber.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
      take: 50,
    });
    const check = checkIpRateLimit(recent.map((r) => r.createdAt), new Date(), 20);
    if (!check.allowed) {
      return NextResponse.json({ error: "Too many requests. Try again shortly." }, { status: 429 });
    }
  }

  await prisma.newsletterSubscriber.upsert({
    where: { email },
    update: { unsubscribedAt: null },
    create: { email, source },
  });

  return NextResponse.json({ ok: true });
}
