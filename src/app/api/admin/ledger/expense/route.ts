import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

// Manual entry point for costs that aren't auto-logged by a webhook —
// hosting, domain renewal, an SMS provider's monthly invoice, AI
// generation API spend, mentor payouts, etc.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const { amountInPaise, category, description, occurredAt, userId } = body ?? {};

  if (!Number.isInteger(amountInPaise) || amountInPaise <= 0 || typeof category !== "string" || !category.trim() || typeof description !== "string" || !description.trim()) {
    return NextResponse.json({ error: "amountInPaise (positive int), category, and description are required" }, { status: 400 });
  }

  const entry = await prisma.ledgerEntry.create({
    data: {
      type: "EXPENSE",
      amountInPaise,
      category,
      description,
      userId: typeof userId === "string" ? userId : null,
      occurredAt: occurredAt ? new Date(occurredAt) : new Date(),
    },
  });

  return NextResponse.json({ entry });
}
