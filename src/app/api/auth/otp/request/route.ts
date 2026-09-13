import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOtp, hashOtp, isValidIdentifier, normalizeIdentifier, otpExpiryDate } from "@/lib/otp";
import { checkIdentifierRateLimit, checkIpRateLimit, WINDOW_MINUTES } from "@/lib/rateLimit";

// TODO before public launch: actually send the code — MSG91/Twilio for
// phone numbers, a transactional email provider (Resend, etc.) for emails.
// Until one is wired up, the code is only logged server-side; devCode is
// only ever returned to the client outside production, as a dev convenience.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const raw = body?.identifier;

  if (typeof raw !== "string" || !isValidIdentifier(raw)) {
    return NextResponse.json({ error: "Enter a valid email or phone number." }, { status: 400 });
  }

  const identifier = normalizeIdentifier(raw);
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

  return NextResponse.json({
    sent: true,
    devCode: process.env.NODE_ENV !== "production" ? code : undefined,
  });
}
