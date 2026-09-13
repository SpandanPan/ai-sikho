import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public — browsing mentors doesn't require sign-in, same as the course
// catalog. Only booking a slot does.
//
// No dynamic segment on this route, so Next.js tries to statically
// prerender it at build time — including in CI, where DATABASE_URL is a
// placeholder that can't actually be reached. The try/catch isn't just
// defensive for a live down-database; without it, `npm run build` itself
// fails (this broke CI once already — see git history).
export async function GET() {
  try {
    const mentors = await prisma.mentor.findMany({
      where: { active: true },
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true, credentials: true, bio: true, photoUrl: true, pricePerSessionInPaise: true },
    });
    return NextResponse.json({ mentors });
  } catch {
    return NextResponse.json({ mentors: [] });
  }
}
