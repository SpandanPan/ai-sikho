import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkIpRateLimit } from "@/lib/rateLimit";
import { sendEmail, buildSupportAckEmail, EMAIL_ADDRESSES } from "@/lib/email";

// Public and unauthenticated, same reasoning as /api/inquiries — someone
// needing help may not be signed in (that could be the actual problem).
// Rate limited by IP, same pattern.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { name, email, message } = body ?? {};

  if (
    typeof name !== "string" || !name.trim() ||
    typeof email !== "string" || !email.trim() ||
    typeof message !== "string" || !message.trim()
  ) {
    return NextResponse.json({ error: "name, email, and a message are required" }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  if (ip) {
    const since = new Date(Date.now() - 15 * 60 * 1000);
    const recent = await prisma.supportRequest.findMany({
      where: { ip, createdAt: { gte: since } },
      select: { createdAt: true },
    });
    const ipCheck = checkIpRateLimit(recent.map((r) => r.createdAt), new Date(), 5);
    if (!ipCheck.allowed) {
      return NextResponse.json({ error: "Too many requests. Try again shortly." }, { status: 429 });
    }
  }

  const request = await prisma.supportRequest.create({
    data: { name: name.trim(), email: email.trim(), message: message.trim(), ip },
  });

  // Best-effort on both sides — a failed email must never make the user's
  // message look lost when it's actually saved (the SupportRequest row is
  // the source of truth, not the email).
  await sendEmail({
    from: EMAIL_ADDRESSES.support,
    to: EMAIL_ADDRESSES.support,
    subject: `New support request from ${name.trim()}`,
    html: `<p><b>${name.trim()}</b> (${email.trim()}) wrote:</p><p>${message.trim()}</p>`,
  }).catch(() => {});
  await sendEmail(buildSupportAckEmail({ to: email.trim(), name: name.trim() })).catch(() => {});

  return NextResponse.json({ request: { id: request.id } });
}
