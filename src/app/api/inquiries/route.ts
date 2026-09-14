import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkIpRateLimit } from "@/lib/rateLimit";

// Public and unauthenticated — a business reaching out isn't necessarily an
// existing site user. Rate limited by IP (same pattern as OTP requests, see
// src/lib/rateLimit.ts) so one person can't flood the inbox.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { service, name, email, phone, message } = body ?? {};

  if (
    typeof service !== "string" || !service.trim() ||
    typeof name !== "string" || !name.trim() ||
    !((typeof email === "string" && email.trim()) || (typeof phone === "string" && phone.trim()))
  ) {
    return NextResponse.json({ error: "service, name, and an email or phone are required" }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  if (ip) {
    const since = new Date(Date.now() - 15 * 60 * 1000);
    const recent = await prisma.serviceInquiry.findMany({
      where: { ip, createdAt: { gte: since } },
      select: { createdAt: true },
    });
    const ipCheck = checkIpRateLimit(recent.map((r) => r.createdAt), new Date(), 5);
    if (!ipCheck.allowed) {
      return NextResponse.json({ error: "Too many requests. Try again shortly." }, { status: 429 });
    }
  }

  const inquiry = await prisma.serviceInquiry.create({
    data: {
      service: service.trim(),
      name: name.trim(),
      email: typeof email === "string" && email.trim() ? email.trim() : null,
      phone: typeof phone === "string" && phone.trim() ? phone.trim() : null,
      message: typeof message === "string" && message.trim() ? message.trim() : null,
      ip,
    },
  });

  return NextResponse.json({ inquiry: { id: inquiry.id } });
}
