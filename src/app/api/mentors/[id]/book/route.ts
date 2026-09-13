import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isWithinBookingWindow } from "@/lib/mentorSlots";

// Booking is signed-in only (it's a paid, per-user record) and race-safe:
// two people clicking the same slot at the same instant can't both win it.
// The atomic step is the conditional updateMany below — its WHERE clause
// (booked: false) is evaluated by Postgres itself, not read-then-write in
// application code, so there's no window for a second request to sneak in
// between "check" and "claim."
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const slotId = body?.slotId;
  if (typeof slotId !== "string") {
    return NextResponse.json({ error: "slotId is required" }, { status: 400 });
  }

  const mentor = await prisma.mentor.findUnique({ where: { id: params.id } });
  if (!mentor || !mentor.active) return NextResponse.json({ error: "Mentor not found" }, { status: 404 });

  const slot = await prisma.mentorSlot.findUnique({ where: { id: slotId } });
  if (!slot || slot.mentorId !== mentor.id) {
    return NextResponse.json({ error: "Slot not found" }, { status: 404 });
  }
  if (!isWithinBookingWindow(slot.startTime)) {
    return NextResponse.json({ error: "This slot is outside the 15-day booking window" }, { status: 400 });
  }

  try {
    const booking = await prisma.$transaction(async (tx) => {
      const claim = await tx.mentorSlot.updateMany({
        where: { id: slotId, booked: false },
        data: { booked: true },
      });
      if (claim.count === 0) {
        throw new Error("SLOT_TAKEN");
      }
      return tx.mentorBooking.create({
        data: {
          userId,
          mentorId: mentor.id,
          slotId,
          amountInPaise: mentor.pricePerSessionInPaise,
          status: "PENDING", // flips to PAID via the same Razorpay webhook pattern as Purchase
        },
      });
    });

    return NextResponse.json({ booking });
  } catch (err) {
    if (err instanceof Error && err.message === "SLOT_TAKEN") {
      return NextResponse.json({ error: "That slot was just booked by someone else — pick another." }, { status: 409 });
    }
    throw err;
  }
}
