import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { summarizeLedger, paiseToRupees } from "@/lib/ledger";
import { toCsv } from "@/lib/csv";

// The CA report. ?from=&to= (ISO dates, default: everything) and
// ?format=csv to download instead of a JSON summary — CSV is genuinely
// what a CA wants, importable straight into Excel/Tally.
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const url = new URL(req.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const format = url.searchParams.get("format");

  const where = {
    ...(from || to
      ? {
          occurredAt: {
            ...(from ? { gte: new Date(from) } : {}),
            ...(to ? { lte: new Date(to) } : {}),
          },
        }
      : {}),
  };

  const entries = await prisma.ledgerEntry.findMany({
    where,
    orderBy: { occurredAt: "desc" },
    include: { user: { select: { email: true, phone: true } } },
  });

  if (format === "csv") {
    const rows = entries.map((e) => ({
      date: e.occurredAt.toISOString().slice(0, 10),
      type: e.type,
      category: e.category,
      description: e.description,
      amount_inr: paiseToRupees(e.amountInPaise),
      customer: e.user?.email ?? e.user?.phone ?? "",
      purchase_id: e.purchaseId ?? "",
    }));
    const csv = toCsv(rows, ["date", "type", "category", "description", "amount_inr", "customer", "purchase_id"]);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="ledger-${from ?? "all"}-to-${to ?? "now"}.csv"`,
      },
    });
  }

  const summary = summarizeLedger(entries);

  // Per-user breakdown: what they paid, what it cost to serve them
  // (their share of platform fees + any expense entries tagged to them),
  // and the resulting profit — exactly "who bought what, what it cost,
  // what I made."
  const byUser = new Map<string, { email: string | null; phone: string | null; revenue: number; fees: number; expenses: number; refunds: number }>();
  for (const e of entries) {
    if (!e.userId) continue;
    const row = byUser.get(e.userId) ?? {
      email: e.user?.email ?? null,
      phone: e.user?.phone ?? null,
      revenue: 0,
      fees: 0,
      expenses: 0,
      refunds: 0,
    };
    if (e.type === "REVENUE") row.revenue += e.amountInPaise;
    if (e.type === "PLATFORM_FEE") row.fees += e.amountInPaise;
    if (e.type === "EXPENSE") row.expenses += e.amountInPaise;
    if (e.type === "REFUND") row.refunds += e.amountInPaise;
    byUser.set(e.userId, row);
  }
  const perUser = [...byUser.entries()].map(([userId, r]) => ({
    userId,
    email: r.email,
    phone: r.phone,
    revenueInPaise: r.revenue,
    costInPaise: r.fees + r.expenses + r.refunds,
    profitInPaise: r.revenue - r.fees - r.expenses - r.refunds,
  }));

  return NextResponse.json({ summary, perUser, entryCount: entries.length });
}
