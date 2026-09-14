import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { toCsv } from "@/lib/csv";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: { unsubscribedAt: null },
    orderBy: { createdAt: "desc" },
  });

  if (new URL(req.url).searchParams.get("format") === "csv") {
    const rows = subscribers.map((s) => ({
      email: s.email,
      source: s.source ?? "",
      subscribed_at: s.createdAt.toISOString().slice(0, 10),
    }));
    const csv = toCsv(rows, ["email", "source", "subscribed_at"]);
    return new NextResponse(csv, {
      headers: { "Content-Type": "text/csv", "Content-Disposition": 'attachment; filename="newsletter.csv"' },
    });
  }

  return NextResponse.json({ subscribers, count: subscribers.length });
}
