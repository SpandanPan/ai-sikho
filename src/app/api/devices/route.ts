import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Self-service escape hatch for the 2-device cap: a legitimate user who's
// hit the limit (new phone, cleared cookies, whatever) can see their active
// devices here and sign one out without contacting support.
export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const devices = await prisma.deviceSession.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    select: { id: true, deviceId: true, createdAt: true },
  });

  return NextResponse.json({
    devices,
    currentDeviceId: session.user?.deviceId ?? null,
  });
}
