import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// force-dynamic: without it, Next.js statically prerenders this route at
// build time and — this was a real, live bug, not just a theoretical one —
// serves that one frozen response to every request in production forever
// after, no matter how many new mentors get onboarded. The try/catch below
// still matters on top of this: build-time DATABASE_URL is a placeholder
// that can't actually be reached, so without it `npm run build` itself
// fails (this broke CI once already — see git history).
export const dynamic = "force-dynamic";

// Public — browsing mentors doesn't require sign-in, same as the course
// catalog. Only booking a slot does.
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
