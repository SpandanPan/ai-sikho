import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOtp, hashOtp, isEmail, isValidIdentifier, normalizeIdentifier, otpExpiryDate } from "@/lib/otp";
import { checkIdentifierRateLimit, checkIpRateLimit, WINDOW_MINUTES } from "@/lib/rateLimit";
import { buildOtpEmail, isEmailConfigured, sendEmail } from "@/lib/email";

// Email OTP is wired up for real (via Resend, once RESEND_API_KEY is set —
// see .env.example/DEPLOY.md). Phone/SMS (MSG91/Twilio) is NOT — a phone
// identifier in production fails honestly below instead of claiming
// "sent" with nothing actually delivered. devCode is only ever returned
// to the client outside production, as a dev convenience.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const raw = body?.identifier;

  if (typeof raw !== "string" || !isValidIdentifier(raw)) {
    return NextResponse.json({ error: "Enter a valid email or phone number." }, { status: 400 });
  }

  const identifier = normalizeIdentifier(raw);
  const identifierIsEmail = isEmail(identifier);

  // No SMS provider exists yet (see AGENT_COSTS.md/DEPLOY.md) — rather
  // than burn a rate-limit slot and a DB row generating a code that can
  // never reach the user, fail before any of that in production. Local
  // dev still works via devCode below, same as it always has.
  if (!identifierIsEmail && process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Phone sign-in isn't available yet — please use your email instead." },
      { status: 400 }
    );
  }
  // x-forwarded-for can carry a comma-separated chain (client, proxy, proxy…)
  // — the first entry is the original client.
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

  const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000);

  const [byIdentifier, byIp] = await Promise.all([
    prisma.otpCode.findMany({
      where: { identifier, createdAt: { gte: windowStart } },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }),
    ip
      ? prisma.otpCode.findMany({
          where: { ip, createdAt: { gte: windowStart } },
          orderBy: { createdAt: "desc" },
          select: { createdAt: true },
        })
      : Promise.resolve([]),
  ]);

  const identifierCheck = checkIdentifierRateLimit(byIdentifier.map((r) => r.createdAt));
  if (!identifierCheck.allowed) {
    return NextResponse.json({ error: identifierCheck.reason }, { status: 429 });
  }

  if (ip) {
    // Looser, IP-scoped check: stops someone spraying OTP requests across
    // many different phone numbers/emails from one source, which the
    // per-identifier limit above wouldn't catch on its own. No cooldown
    // here on purpose — see checkIpRateLimit's docstring.
    const ipCheck = checkIpRateLimit(byIp.map((r) => r.createdAt));
    if (!ipCheck.allowed) {
      return NextResponse.json({ error: ipCheck.reason }, { status: 429 });
    }
  }

  const code = generateOtp();

  await prisma.otpCode.create({
    data: {
      identifier,
      ip,
      codeHash: hashOtp(code),
      expiresAt: otpExpiryDate(),
    },
  });

  console.log(`[OTP] ${identifier} -> ${code}`);

  if (identifierIsEmail) {
    const result = await sendEmail(buildOtpEmail({ to: identifier, code }));
    // Only a genuine send failure is a hard error — RESEND_API_KEY simply
    // being unset (isEmailConfigured() false) is expected in local dev and
    // already logged by sendEmail itself; devCode below covers that case.
    if (!result.sent && isEmailConfigured()) {
      return NextResponse.json({ error: "Couldn't send the code — try again in a moment." }, { status: 502 });
    }
  }

  return NextResponse.json({
    sent: true,
    devCode: process.env.NODE_ENV !== "production" ? code : undefined,
  });
}
