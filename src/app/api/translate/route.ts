import { NextResponse } from "next/server";
import { translateText, isIndicLanguage } from "@/lib/translate";

// Public, no auth — a free demo, not a metered paid feature (self-hosted
// model, $0 marginal cost either way). Same reachability constraint as
// every other Ollama-backed route: works where OLLAMA_BASE_URL is
// actually reachable, verified in local dev, not yet from a live
// deployment — see AGENT_COSTS.md.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { text, targetLanguage } = body ?? {};

  if (typeof text !== "string" || !text.trim() || text.length > 300) {
    return NextResponse.json({ error: "text (max 300 characters) is required" }, { status: 400 });
  }
  if (!isIndicLanguage(targetLanguage)) {
    return NextResponse.json({ error: "targetLanguage must be a supported Indic language" }, { status: 400 });
  }

  try {
    const translated = await translateText(text.trim(), targetLanguage);
    return NextResponse.json({ translated });
  } catch (err) {
    console.error("[translate] failed:", err);
    return NextResponse.json({ error: "Translation is temporarily unavailable — try again shortly." }, { status: 502 });
  }
}
