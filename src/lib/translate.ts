import { ollamaAuthHeaders } from "./ollamaAuth";

// Two distinct tasks get two distinct models internally — translation and
// open-ended Q&A are different jobs and one model doesn't do both well.
// Which model runs which job is an internal implementation detail, not
// something surfaced in any user-facing copy in this file or its callers.
const TRANSLATE_MODEL = process.env.TRANSLATE_MODEL ?? "translategemma";
const CHAT_MODEL = process.env.CHAT_MODEL ?? "gemma4:e4b";

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
    headers: { "Content-Type": "application/json", ...ollamaAuthHeaders() },
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

// Open-ended Q&A in an Indic language — a genuine answer to a genuine
// question, not a translation of fixed sample text. Deliberately a
// separate function/model from translateText above: answering a question
// well and translating a sentence well are different skills.
export async function answerInLanguage(question: string, targetLanguage: IndicLanguage): Promise<string> {
  const baseUrl = process.env.OLLAMA_BASE_URL;
  if (!baseUrl) throw new Error("OLLAMA_BASE_URL is not set.");

  const res = await fetch(`${baseUrl.replace(/\/$/, "")}/v1/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...ollamaAuthHeaders() },
    body: JSON.stringify({
      model: CHAT_MODEL,
      messages: [
        {
          role: "system",
          content: `Answer the user's question in ${targetLanguage}, written in the ${targetLanguage} script — not transliterated into Latin letters. Keep the answer short: 2-4 sentences, plain language, no headings.`,
        },
        { role: "user", content: question },
      ],
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Chat request to ${baseUrl} failed (${res.status}): ${body.slice(0, 300)}`);
  }
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string") throw new Error("Unexpected response shape from chat model.");
  return content.trim();
}
