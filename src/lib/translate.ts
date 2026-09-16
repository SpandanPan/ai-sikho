// A deliberately separate agent from contentAgent.ts's drafting/grading
// family — translation into Indic scripts is a distinct task, and
// gemma4:e4b (the general local default) isn't a translation specialist.
// Per the "don't force one local model onto every task" call: this uses
// translategemma, an Ollama model built specifically for translation,
// pulled and verified for real against Hindi/Telugu/Bengali/Marathi
// during this build — see AGENT_COSTS.md.
const TRANSLATE_MODEL = process.env.TRANSLATE_MODEL ?? "translategemma";

export const SUPPORTED_INDIC_LANGUAGES = [
  "Hindi",
  "Telugu",
  "Bengali",
  "Marathi",
  "Tamil",
  "Kannada",
  "Gujarati",
  "Malayalam",
] as const;

export type IndicLanguage = (typeof SUPPORTED_INDIC_LANGUAGES)[number];

export function isIndicLanguage(lang: unknown): lang is IndicLanguage {
  return typeof lang === "string" && (SUPPORTED_INDIC_LANGUAGES as readonly string[]).includes(lang);
}

export async function translateText(text: string, targetLanguage: IndicLanguage): Promise<string> {
  const baseUrl = process.env.OLLAMA_BASE_URL;
  if (!baseUrl) throw new Error("OLLAMA_BASE_URL is not set.");

  const res = await fetch(`${baseUrl.replace(/\/$/, "")}/v1/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: TRANSLATE_MODEL,
      messages: [{ role: "user", content: `Translate to ${targetLanguage}: ${text}` }],
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Translation request to ${baseUrl} failed (${res.status}): ${body.slice(0, 300)}`);
  }
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string") throw new Error("Unexpected response shape from translation model.");
  return content.trim();
}
