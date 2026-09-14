import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function assertOwnership(id: string, userId: string) {
  const note = await prisma.note.findUnique({ where: { id } });
  return note && note.userId === userId ? note : null;
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  if (!(await assertOwnership(params.id, userId))) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const { title, content } = body ?? {};
  if (typeof title !== "string" || !title.trim() || typeof content !== "string") {
    return NextResponse.json({ error: "title and content are required" }, { status: 400 });
  }

  const note = await prisma.note.update({ where: { id: params.id }, data: { title: title.trim(), content } });
  return NextResponse.json({ note });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  if (!(await assertOwnership(params.id, userId))) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.note.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
