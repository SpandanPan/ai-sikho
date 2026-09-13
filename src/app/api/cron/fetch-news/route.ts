import { NextResponse } from "next/server";
import { fetchAndStoreNews } from "@/lib/fetchNews";

// Vercel Cron hits this on the schedule in vercel.json. Guarded by
// CRON_SECRET so a random person can't trigger it (or spam it) themselves.
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await fetchAndStoreNews();
  return NextResponse.json(result);
}
