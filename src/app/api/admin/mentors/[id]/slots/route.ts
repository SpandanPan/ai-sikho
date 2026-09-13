import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

// Add one or more availability slots for a mentor. Body: { slots: [{
// startTime: ISO string, durationMinutes?: number }] } — takes a batch so
// onboarding two weeks of availability isn't one request per slot.
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const mentor = await prisma.mentor.findUnique({ where: { id: params.id } });
  if (!mentor) return NextResponse.json({ error: "Mentor not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const slots = body?.slots;
  if (!Array.isArray(slots) || slots.length === 0) {
    return NextResponse.json({ error: "slots must be a non-empty array" }, { status: 400 });
  }

  const parsed = [];
  for (const s of slots) {
    const startTime = new Date(s?.startTime);
    if (Number.isNaN(startTime.getTime())) {
      return NextResponse.json({ error: `Invalid startTime: ${s?.startTime}` }, { status: 400 });
    }
    parsed.push({
      mentorId: mentor.id,
      startTime,
      durationMinutes: Number.isInteger(s?.durationMinutes) ? s.durationMinutes : 30,
    });
  }

  const created = await prisma.mentorSlot.createMany({ data: parsed });
  return NextResponse.json({ created: created.count });
}
