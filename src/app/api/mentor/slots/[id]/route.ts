import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// A mentor removing their own open (unbooked) slot. Deliberately refuses to
// touch a booked one — a customer already paid for it; cancelling that is
// a refund-flow decision (see src/lib/refunds.ts), not a delete button.
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const mentor = await prisma.mentor.findUnique({ where: { userId }, select: { id: true } });
  if (!mentor) return NextResponse.json({ error: "This account isn't linked to a mentor profile." }, { status: 403 });

  const slot = await prisma.mentorSlot.findUnique({ where: { id: params.id } });
  if (!slot || slot.mentorId !== mentor.id) {
    return NextResponse.json({ error: "Slot not found" }, { status: 404 });
  }
  if (slot.booked) {
    return NextResponse.json({ error: "Can't delete a booked slot — it's already been paid for." }, { status: 409 });
  }

  await prisma.mentorSlot.delete({ where: { id: params.id } });
  return NextResponse.json({ deleted: true });
}
