import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Self-service mentor dashboard data — everything /mentor needs in one
// call. Gated on Mentor.userId matching the signed-in session, not on
// ADMIN_EMAILS: a mentor is not necessarily an admin.
async function requireMentor(): Promise<{ error: NextResponse } | { mentorId: string }> {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return { error: NextResponse.json({ error: "Sign in required" }, { status: 401 }) };

  const mentor = await prisma.mentor.findUnique({ where: { userId }, select: { id: true } });
  if (!mentor) return { error: NextResponse.json({ error: "This account isn't linked to a mentor profile." }, { status: 403 }) };
  return { mentorId: mentor.id };
}

export async function GET() {
  const check = await requireMentor();
  if ("error" in check) return check.error;

  const [mentor, slots, bookings] = await Promise.all([
    prisma.mentor.findUnique({ where: { id: check.mentorId } }),
    prisma.mentorSlot.findMany({
      where: { mentorId: check.mentorId, startTime: { gte: new Date() } },
      orderBy: { startTime: "asc" },
    }),
    prisma.mentorBooking.findMany({
      where: { mentorId: check.mentorId, status: "PAID" },
      include: { user: { select: { name: true, email: true, phone: true } }, slot: true },
      orderBy: { slot: { startTime: "asc" } },
    }),
  ]);

  return NextResponse.json({
    mentor,
    slots: slots.map((s) => ({ id: s.id, startTime: s.startTime, durationMinutes: s.durationMinutes, booked: s.booked })),
    bookings: bookings
      .filter((b) => b.slot.startTime >= new Date())
      .map((b) => ({
        id: b.id,
        startTime: b.slot.startTime,
        durationMinutes: b.slot.durationMinutes,
        customerName: b.user.name ?? b.user.email ?? b.user.phone ?? "Customer",
        meetingHostUrl: b.meetingHostUrl,
        meetingProvider: b.meetingProvider,
      })),
  });
}

export async function PATCH(req: Request) {
  const check = await requireMentor();
  if ("error" in check) return check.error;

  const body = await req.json().catch(() => null);
  const { credentials, bio, photoUrl, pricePerSessionInPaise, personalMeetingUrl } = body ?? {};

  const data: Record<string, unknown> = {};
  if (credentials !== undefined) {
    if (typeof credentials !== "string" || !credentials.trim()) {
      return NextResponse.json({ error: "credentials can't be empty" }, { status: 400 });
    }
    data.credentials = credentials.trim();
  }
  if (bio !== undefined) {
    if (typeof bio !== "string" || !bio.trim()) {
      return NextResponse.json({ error: "bio can't be empty" }, { status: 400 });
    }
    data.bio = bio.trim();
  }
  if (photoUrl !== undefined) {
    data.photoUrl = typeof photoUrl === "string" && photoUrl.trim() ? photoUrl.trim() : null;
  }
  if (pricePerSessionInPaise !== undefined) {
    if (!Number.isInteger(pricePerSessionInPaise) || pricePerSessionInPaise <= 0) {
      return NextResponse.json({ error: "pricePerSessionInPaise must be a positive integer" }, { status: 400 });
    }
    data.pricePerSessionInPaise = pricePerSessionInPaise;
  }
  if (personalMeetingUrl !== undefined) {
    data.personalMeetingUrl = typeof personalMeetingUrl === "string" && personalMeetingUrl.trim() ? personalMeetingUrl.trim() : null;
  }

  const mentor = await prisma.mentor.update({ where: { id: check.mentorId }, data });
  return NextResponse.json({ mentor });
}
