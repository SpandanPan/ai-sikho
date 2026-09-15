import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Mentor's own self-service version of POST /api/admin/mentors/[id]/slots —
// same batch shape, scoped to whichever Mentor row the signed-in session is
// linked to instead of an admin picking an id. The admin route still works
// too (useful if you're helping a mentor who isn't comfortable with the
// dashboard yet).
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const mentor = await prisma.mentor.findUnique({ where: { userId }, select: { id: true } });
  if (!mentor) return NextResponse.json({ error: "This account isn't linked to a mentor profile." }, { status: 403 });

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
