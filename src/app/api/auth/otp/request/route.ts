import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOtp, hashOtp, isValidIdentifier, normalizeIdentifier, otpExpiryDate } from "@/lib/otp";

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
  const code = generateOtp();

  await prisma.otpCode.create({
    data: {
      identifier,
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
