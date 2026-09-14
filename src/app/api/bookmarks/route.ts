import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function isValidUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const bookmarks = await prisma.bookmark.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ bookmarks });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const { title, url, tag } = body ?? {};
  if (typeof title !== "string" || !title.trim() || typeof url !== "string" || !isValidUrl(url)) {
    return NextResponse.json({ error: "title and a valid http(s) url are required" }, { status: 400 });
  }

  const bookmark = await prisma.bookmark.create({
    data: { userId, title: title.trim(), url, tag: typeof tag === "string" && tag.trim() ? tag.trim() : null },
  });
  return NextResponse.json({ bookmark });
}
