import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { summarizeLedgerByDay } from "@/lib/ledger";

// ?days=30 (default) — revenue vs. cost (Razorpay fees + AI generation +
// any other logged expense) per day, for the "daily costs" panel on
// /admin/reports. Same admin-only, never-shown-to-customers rule as the
// traffic timeseries.
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const days = Number(new URL(req.url).searchParams.get("days") ?? "30") || 30;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const entries = await prisma.ledgerEntry.findMany({
    where: { createdAt: { gte: since } },
    select: { type: true, amountInPaise: true, createdAt: true },
  });

  return NextResponse.json({ days, series: summarizeLedgerByDay(entries) });
}
