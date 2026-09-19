import { NextResponse } from "next/server";
import { translateText, answerInLanguage, isIndicLanguage } from "@/lib/translate";

// Public, no auth — a demo feature, not a metered paid one. Same
// reachability constraint as every other locally-run agent route: works
// where the model backend is actually reachable, verified in local dev,
// not yet from a live deployment.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { text, targetLanguage, mode } = body ?? {};

  if (typeof text !== "string" || !text.trim() || text.length > 300) {
    return NextResponse.json({ error: "text (max 300 characters) is required" }, { status: 400 });
  }
  if (!isIndicLanguage(targetLanguage)) {
    return NextResponse.json({ error: "targetLanguage must be a supported Indic language" }, { status: 400 });
  }

  try {
    const result =
      mode === "chat"
        ? await answerInLanguage(text.trim(), targetLanguage)
        : await translateText(text.trim(), targetLanguage);
    return NextResponse.json({ result });
  } catch (err) {
    console.error("[translate] failed:", err);
    return NextResponse.json({ error: "Temporarily unavailable — try again shortly." }, { status: 502 });
  }
}
