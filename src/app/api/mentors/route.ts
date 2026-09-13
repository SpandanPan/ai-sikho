import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public — browsing mentors doesn't require sign-in, same as the course
// catalog. Only booking a slot does.
export async function GET() {
  const mentors = await prisma.mentor.findMany({
    where: { active: true },
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, credentials: true, bio: true, photoUrl: true, pricePerSessionInPaise: true },
  });
  return NextResponse.json({ mentors });
}
