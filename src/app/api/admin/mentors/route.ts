import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

// Onboarding mentors is deliberately admin-only (see src/lib/admin.ts) —
// there's no self-service mentor signup by design.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const { name, credentials, bio, photoUrl, pricePerSessionInPaise } = body ?? {};

  if (
    typeof name !== "string" || !name.trim() ||
    typeof credentials !== "string" || !credentials.trim() ||
    typeof bio !== "string" || !bio.trim() ||
    !Number.isInteger(pricePerSessionInPaise) || pricePerSessionInPaise <= 0
  ) {
    return NextResponse.json({ error: "name, credentials, bio, and a positive pricePerSessionInPaise are required" }, { status: 400 });
  }

  const mentor = await prisma.mentor.create({
    data: { name, credentials, bio, photoUrl: photoUrl || null, pricePerSessionInPaise },
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
