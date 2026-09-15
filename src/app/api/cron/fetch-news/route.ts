import { NextResponse } from "next/server";
import { fetchAndStoreNews, generateMissingTakeaways } from "@/lib/fetchNews";

// Vercel Cron hits this hourly (vercel.json). Guarded by CRON_SECRET so a
// random person can't trigger it (or spam it) themselves.
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const news = await fetchAndStoreNews();
  // Best-effort, after the fetch — see generateMissingTakeaways's own
  // comment for why a takeaway failure never affects the fetch result.
  const takeaways = await generateMissingTakeaways();
  return NextResponse.json({ news, takeaways });
}
