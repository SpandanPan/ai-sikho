import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const VALID_TYPES = new Set(["PAGE_VIEW", "CLICK", "TIME_ON_PAGE"]);

// Public, intentionally — every visitor gets tracked, not just signed-in
// ones. No rate limiting here (unlike OTP): worst case of abuse is noisy
// analytics data, not a real cost or security exposure, so it's not worth
// the false-positive risk of blocking a legitimate heavy user.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { type, path, referrer, anonId, label, valueMs } = body ?? {};

  if (!VALID_TYPES.has(type) || typeof path !== "string" || typeof anonId !== "string") {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  try {
    const session = await getServerSession(authOptions);
    await prisma.analyticsEvent.create({
      data: {
        type,
        path: path.slice(0, 500),
        referrer: typeof referrer === "string" ? referrer.slice(0, 500) : null,
        anonId: anonId.slice(0, 100),
        userId: session?.user?.id ?? null,
        label: typeof label === "string" ? label.slice(0, 200) : null,
        valueMs: typeof valueMs === "number" ? Math.round(valueMs) : null,
      },
    });
    return NextResponse.json({ ok: true });
  } catch {
    // Analytics must never break the page it's tracking.
    return NextResponse.json({ ok: false });
  }
}
