import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Deleting the User row cascades to everything genuinely personal
// (accounts, sessions, device sessions, course progress, ratings,
// purchases, mentor bookings — see the onDelete: Cascade relations in
// prisma/schema.prisma). QuizAttempt is the one deliberate exception: its
// userId is nullable with onDelete: SetNull, so the attempt survives
// anonymized for aggregate stats instead of vanishing entirely — that's the
// "right to deletion, not right to erase our records of what happened"
// distinction described in /privacy.
// Updating the display name — the one piece of profile info that's actually
// editable. Email/phone aren't, since they're the sign-in identity itself
// (see the unique-constraint/upsert design in src/lib/auth.ts) — changing
// one would mean changing which account you are, not editing a detail.
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const name = body?.name;
  if (typeof name !== "string" || !name.trim() || name.trim().length > 100) {
    return NextResponse.json({ error: "A name (1-100 characters) is required" }, { status: 400 });
  }

  const user = await prisma.user.update({ where: { id: userId }, data: { name: name.trim() } });
  return NextResponse.json({ name: user.name });
}

export async function DELETE() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  await prisma.user.delete({ where: { id: userId } });
  return NextResponse.json({ ok: true });
}
