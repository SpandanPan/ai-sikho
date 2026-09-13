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
export async function DELETE() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  await prisma.user.delete({ where: { id: userId } });
  return NextResponse.json({ ok: true });
}
