import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Deleting the row is the entire mechanism — the jwt callback checks on
// every request whether a token's deviceId still exists, so this device is
// signed out (at most one request later) with no separate "revoke" step.
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const device = await prisma.deviceSession.findUnique({ where: { id: params.id } });
  if (!device || device.userId !== userId) {
    // Same response whether it's someone else's device or doesn't exist —
    // don't leak which device ids are real.
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.deviceSession.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
