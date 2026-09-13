import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bookingWindow } from "@/lib/mentorSlots";

// Open slots only, and only within the rolling 15-day window from right
// now — never a fixed calendar range, so this has to be computed on every
// request rather than cached.
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { from, to } = bookingWindow();

  const slots = await prisma.mentorSlot.findMany({
    where: { mentorId: params.id, booked: false, startTime: { gte: from, lte: to } },
    orderBy: { startTime: "asc" },
    select: { id: true, startTime: true, durationMinutes: true },
  });

  return NextResponse.json({ slots });
}
