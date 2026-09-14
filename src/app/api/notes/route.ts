import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const notes = await prisma.note.findMany({ where: { userId }, orderBy: { updatedAt: "desc" } });
  return NextResponse.json({ notes });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const { title, content } = body ?? {};
  if (typeof title !== "string" || !title.trim() || typeof content !== "string") {
    return NextResponse.json({ error: "title and content are required" }, { status: 400 });
  }

  const note = await prisma.note.create({ data: { userId, title: title.trim(), content } });
  return NextResponse.json({ note });
}
