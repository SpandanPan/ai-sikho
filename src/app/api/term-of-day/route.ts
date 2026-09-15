import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { evergreenTermForDay } from "@/lib/termOfDay";
import { startOfUtcDay } from "@/lib/dateUtils";

export const dynamic = "force-dynamic"; // see /api/news's comment — same static-caching trap otherwise

export async function GET() {
  try {
    const today = startOfUtcDay();
    const row = await prisma.termOfDay.findUnique({ where: { date: today } });
    if (row) {
      return NextResponse.json({ term: row.term, definition: row.definition, source: row.source });
    }
  } catch {
    // DB unreachable — fall through to the evergreen set below.
  }

  const fallback = evergreenTermForDay();
  return NextResponse.json({ term: fallback.term, definition: fallback.definition, source: "evergreen" });
}
