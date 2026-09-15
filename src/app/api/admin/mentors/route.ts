import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { isEmail, normalizeIdentifier } from "@/lib/otp";

// Onboarding mentors is deliberately admin-only (see src/lib/admin.ts) —
// there's no self-service mentor signup by design. But the mentor still
// needs a way to sign in and reach their own dashboard (/mentor), so this
// links their account by email to the site's normal OTP sign-in flow —
// find-or-create the same way src/lib/auth.ts does on first sign-in, so
// whichever happens first (onboarding here, or the mentor signing in on
// their own before you onboard them) still ends up as one linked account.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const { name, credentials, bio, photoUrl, pricePerSessionInPaise, email } = body ?? {};

  if (
    typeof name !== "string" || !name.trim() ||
    typeof credentials !== "string" || !credentials.trim() ||
    typeof bio !== "string" || !bio.trim() ||
    !Number.isInteger(pricePerSessionInPaise) || pricePerSessionInPaise <= 0 ||
    typeof email !== "string" || !isEmail(email.trim())
  ) {
    return NextResponse.json(
      { error: "name, credentials, bio, a positive pricePerSessionInPaise, and a valid email are required" },
      { status: 400 }
    );
  }

  const normalizedEmail = normalizeIdentifier(email);
  const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existingUser) {
    const alreadyMentor = await prisma.mentor.findUnique({ where: { userId: existingUser.id } });
    if (alreadyMentor) {
      return NextResponse.json({ error: "That email is already linked to a mentor." }, { status: 409 });
    }
  }
  const user = existingUser ?? (await prisma.user.create({ data: { email: normalizedEmail, emailVerified: new Date() } }));

  const mentor = await prisma.mentor.create({
    data: { userId: user.id, name, credentials, bio, photoUrl: photoUrl || null, pricePerSessionInPaise },
  });

  return NextResponse.json({ mentor });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }
  try {
    const mentors = await prisma.mentor.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ mentors });
  } catch {
    // Admin-facing: a real 500 here so it's obviously a DB problem, not
    // silently reported as "no mentors exist" the way the public route does.
    return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
  }
}
