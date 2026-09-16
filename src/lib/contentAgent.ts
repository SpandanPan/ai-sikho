// Admin-triggered content generation drafts — never auto-published. A human
// reviews resultJson and only then does it get copied into the real
// quizQuestions.ts / articles.ts / PathwayPhase data. This mirrors the
// "questions must be written fresh, quality over quantity" standard the
// rest of this product holds itself to — an AI-generated draft doesn't get
// to skip that review just because a machine wrote it first.
//
// Three providers (Claude via Anthropic, GPT via OpenAI, or a self-hosted
// open-source model via Ollama/vLLM) — pick whichever fits the job. See
// AGENT_COSTS.md for which tasks are actually good fits for the free
// self-hosted option vs. which genuinely need a frontier model.
//
// Ollama's OpenAI-compatible endpoint (/v1/chat/completions) is reused here
// rather than its native /api/chat, so it's the same request/response
// shape as callOpenAi below — one real constraint either way: OLLAMA_BASE_URL
// must be a URL this code can actually reach *at the moment it runs*.
//   - Content drafting (generateContent) runs only from /admin/generate,
//     triggered by hand — run it from `npm run dev` on the same machine
//     that's running Ollama and OLLAMA_BASE_URL=http://localhost:11434
//     just works, no tunnel needed.
//   - Grading (gradeAnswer) runs from the Razorpay webhook in production,
//     any time a real customer pays — if you want *that* on a self-hosted
//     model, OLLAMA_BASE_URL needs a real public address (a small always-on
//     VPS, or a tunnel like Cloudflare Tunnel), because Vercel's serverless
//     functions cannot reach "localhost" on your laptop.
//
// Requires ANTHROPIC_API_KEY, OPENAI_API_KEY, and/or OLLAMA_BASE_URL. None
// are set in this environment, so none of these three code paths are
// verified against a real endpoint — each written against its documented
// API contract, not actually run. Test whichever you use before trusting
// its output.
import { MODEL_PRICING_USD_PER_1M, type Provider } from "./agentPricing";

export type GenerationType = "QUIZ" | "ARTICLE" | "ROADMAP";

const SYSTEM_PROMPTS: Record<GenerationType, string> = {
  QUIZ:
    "You write multiple-choice quiz questions for an AI/GenAI engineering interview-prep product. " +
    "Return ONLY a JSON array, no prose, of objects shaped exactly like: " +
    '{"question": string, "options": [string, string, string, string], "correctIdx": number (0-3), "explanation": string}. ' +
    "Questions must be original — never copied or paraphrased from a specific existing course, book, or question bank. " +
    "Explanations should be one or two sentences, accurate, and teach the underlying concept, not just state the answer.",
  ARTICLE:
    "You write short, plain-language explainer articles about AI/ML concepts for a technical audience. " +
    'Return ONLY JSON shaped exactly like: {"title": string, "summary": string (one sentence), "body": string (300-500 words, markdown)}. ' +
    "Explain findings and concepts in your own words. Do not reproduce verbatim text or figures from any specific paper.",
  ROADMAP:
    "You design a multi-phase learning roadmap for someone becoming an AI/GenAI engineer. " +
    'Return ONLY a JSON array of phases shaped exactly like: {"order": number, "title": string, "summary": string, "checkpoint": string (a concrete, verifiable task proving the phase is done)}. ' +
    "4-6 phases, ordered from foundational to advanced.",
};

export function buildPrompt(type: GenerationType, topic: string): { system: string; user: string } {
  return {
    system: SYSTEM_PROMPTS[type],
    user: `Topic: ${topic}`,
  };
}

export class ContentAgentError extends Error {}

export type GenerationResult = {
  content: unknown;
  inputTokens: number;
  outputTokens: number;
  provider: Provider;
  model: string;
};

async function callAnthropic(system: string, user: string): Promise<{ text: string; inputTokens: number; outputTokens: number }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new ContentAgentError("ANTHROPIC_API_KEY is not set.");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model: MODEL_PRICING_USD_PER_1M.anthropic.model,
      max_tokens: 4096,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new ContentAgentError(`Anthropic API error ${res.status}: ${body.slice(0, 300)}`);
  }
  const data = await res.json();
  const text = data?.content?.[0]?.text;
  if (typeof text !== "string") throw new ContentAgentError("Unexpected response shape from Anthropic API.");
  return {
    text,
    inputTokens: data?.usage?.input_tokens ?? 0,
    outputTokens: data?.usage?.output_tokens ?? 0,
  };
}

async function callOpenAi(system: string, user: string): Promise<{ text: string; inputTokens: number; outputTokens: number }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new ContentAgentError("OPENAI_API_KEY is not set.");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: MODEL_PRICING_USD_PER_1M.openai.model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new ContentAgentError(`OpenAI API error ${res.status}: ${body.slice(0, 300)}`);
  }
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (typeof text !== "string") throw new ContentAgentError("Unexpected response shape from OpenAI API.");
  return {
    text,
    inputTokens: data?.usage?.prompt_tokens ?? 0,
    outputTokens: data?.usage?.completion_tokens ?? 0,
  };
}

async function callOllama(system: string, user: string): Promise<{ text: string; inputTokens: number; outputTokens: number }> {
  const baseUrl = process.env.OLLAMA_BASE_URL;
  if (!baseUrl) throw new ContentAgentError("OLLAMA_BASE_URL is not set.");

  const res = await fetch(`${baseUrl.replace(/\/$/, "")}/v1/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL_PRICING_USD_PER_1M.ollama.model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new ContentAgentError(`Ollama request to ${baseUrl} failed (${res.status}): ${body.slice(0, 300)}`);
  }
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (typeof text !== "string") throw new ContentAgentError("Unexpected response shape from Ollama.");
  return {
    text,
    // Not every Ollama version reports token usage on this endpoint — cost
    // is $0 either way (see agentPricing.ts), so a missing count only
    // means the ledger's "tokens used" figure reads 0, not an error.
    inputTokens: data?.usage?.prompt_tokens ?? 0,
    outputTokens: data?.usage?.completion_tokens ?? 0,
  };
}

function callProvider(provider: Provider, system: string, user: string) {
  if (provider === "anthropic") return callAnthropic(system, user);
  if (provider === "openai") return callOpenAi(system, user);
  return callOllama(system, user);
}

// Every prompt in this file asks for "ONLY JSON, no prose" — OpenAI's
// response_format:json_object enforces that itself, but Anthropic and
// (verified against a real local instance) Ollama both sometimes wrap the
// answer in a ```json ... ``` markdown fence anyway. Stripped here, once,
// rather than duplicated in generateContent and gradeAnswer below.
export function extractJsonText(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  return (fenced ? fenced[1] : text).trim();
}

function parseJsonContent(text: string, errorMessage: string): unknown {
  try {
    return JSON.parse(extractJsonText(text));
  } catch {
    throw new ContentAgentError(errorMessage);
  }
}

export async function generateContent(type: GenerationType, topic: string, provider: Provider): Promise<GenerationResult> {
  const { system, user } = buildPrompt(type, topic);

  const { text, inputTokens, outputTokens } = await callProvider(provider, system, user);
  const content = parseJsonContent(text, "Model did not return valid JSON — check the prompt or retry.");

  return { content, inputTokens, outputTokens, provider, model: MODEL_PRICING_USD_PER_1M[provider].model };
}

// ---- Mock-interview answer grading -----------------------------------
// A distinct agent from the drafting ones above: this grades one specific
// person's answer for pay, rather than drafting reusable content for admin
// review. Separate system prompt, separate entry point, on purpose — see
// MockAnswerSubmission in prisma/schema.prisma.
const GRADING_SYSTEM_PROMPT =
  "You are grading one candidate's written answer to an AI/GenAI engineering interview question. " +
  "Be specific and honest — this is paid, real feedback, not encouragement. " +
  'Return ONLY JSON shaped exactly like: {"score": number (1-10), "strengths": [string, string] (1-3 items, specific to what they wrote), ' +
  '"gaps": [string, string] (1-4 items, specific and actionable, not generic), "suggestion": string (one concrete thing to improve first)}. ' +
  "Grade against what a strong answer to this specific question would cover, not a generic rubric.";

export function buildGradingPrompt(category: string, question: string, answerText: string): { system: string; user: string } {
  return {
    system: GRADING_SYSTEM_PROMPT,
    user: `Category: ${category}\n\nQuestion: ${question}\n\nCandidate's answer:\n${answerText}`,
  };
}

export async function gradeAnswer(
  category: string,
  question: string,
  answerText: string,
  provider: Provider
): Promise<GenerationResult> {
  const { system, user } = buildGradingPrompt(category, question, answerText);

  const { text, inputTokens, outputTokens } = await callProvider(provider, system, user);
  const content = parseJsonContent(text, "Grading model did not return valid JSON — check the prompt or retry.");

  return { content, inputTokens, outputTokens, provider, model: MODEL_PRICING_USD_PER_1M[provider].model };
}

// ---- AI Pulse takeaway --------------------------------------------------
// Given ONLY a fetched item's headline + one-line summary — never the full
// article — writes one short, independent sentence on why it matters. That
// "never the full article" constraint is deliberate, not incidental: it's
// what keeps this from crossing into "rewriting/reproducing third-party
// content," the exact risk the headline+excerpt+link design was built to
// avoid in the first place (see README). There's no substantial source
// text here to derive from — just a headline, the same as a human reading
// a news alert and jotting a one-line reaction.
const TAKEAWAY_SYSTEM_PROMPT =
  "You are given only a news headline and a one-sentence summary — never the full article. " +
  "Write ONE short, plain-language sentence (max 20 words) explaining why this matters to someone " +
  "learning AI or job-hunting in AI/ML. Do not invent specific facts beyond what the headline and " +
  "summary already say — if it's not implied by them, leave it out. " +
  'Return ONLY JSON shaped exactly like: {"takeaway": string}.';

export function buildTakeawayPrompt(title: string, summary: string): { system: string; user: string } {
  return { system: TAKEAWAY_SYSTEM_PROMPT, user: `Headline: ${title}\n\nSummary: ${summary}` };
}

export async function generateTakeaway(title: string, summary: string, provider: Provider): Promise<GenerationResult> {
  const { system, user } = buildTakeawayPrompt(title, summary);
  const { text, inputTokens, outputTokens } = await callProvider(provider, system, user);
  const content = parseJsonContent(text, "Takeaway model did not return valid JSON — check the prompt or retry.");
  return { content, inputTokens, outputTokens, provider, model: MODEL_PRICING_USD_PER_1M[provider].model };
}

// ---- Term of the day -----------------------------------------------------
// One AI/ML term + a plain-language definition, refreshed daily by
// src/lib/termOfDay.ts's cron trigger. recentTerms is passed in so the
// model is nudged away from repeating what it already covered — no
// guarantee with a small local model, but it measurably helps.
const TERM_SYSTEM_PROMPT =
  "You explain one AI/ML term in plain language for someone new to the field. " +
  'Return ONLY JSON shaped exactly like: {"term": string, "definition": string (1-2 sentences, no jargon left unexplained)}. ' +
  "Pick a term genuinely useful for an AI/GenAI interview or general AI literacy — not something obscure or academic-only.";

export function buildTermPrompt(recentTerms: string[]): { system: string; user: string } {
  return {
    system: TERM_SYSTEM_PROMPT,
    user: recentTerms.length
      ? `Avoid repeating any of these already-covered terms: ${recentTerms.join(", ")}.`
      : "Pick any genuinely useful term to start with.",
  };
}

export async function generateTerm(recentTerms: string[], provider: Provider): Promise<GenerationResult> {
  const { system, user } = buildTermPrompt(recentTerms);
  const { text, inputTokens, outputTokens } = await callProvider(provider, system, user);
  const content = parseJsonContent(text, "Term-of-day model did not return valid JSON — check the prompt or retry.");
  return { content, inputTokens, outputTokens, provider, model: MODEL_PRICING_USD_PER_1M[provider].model };
}

// ---- Product description drafting ---------------------------------------
// One-off content generation for the product detail pages (/pack/[slug]/
// [variant], /courses) — run via scripts/generate-product-descriptions.ts,
// reviewed by hand, then pasted into src/data/interviewPacks.ts and
// src/data/courses.ts as static content. Same "admin reviews before it
// ships" standard as the QUIZ/ARTICLE/ROADMAP drafting agents above, not
// a live per-request generator — a product description shouldn't reword
// itself on every page load.
//
// No tool/MCP access: this draws only on the model's own knowledge, not a
// live web search or any external lookup — there's no search API wired
// into this app (no key available in this environment). Said plainly
// rather than implied, since "give it tool access" was the actual ask.
const PRODUCT_DESCRIPTION_SYSTEM_PROMPT = {
  layman:
    "You write a short product description for a complete beginner to AI — someone who has never " +
    "written code and may not know what a 'model' even is. Plain English, zero jargon, focus on what " +
    "they'll actually be able to do afterward, not the topics covered. " +
    'Return ONLY JSON shaped exactly like: {"description": string (3-4 sentences)}.',
  technical:
    "You write a short product description for someone already working toward an AI/GenAI engineering " +
    "role — comfortable with technical terms. Be specific about what's covered and why it matters for " +
    "an actual interview or job, not generic marketing language. " +
    'Return ONLY JSON shaped exactly like: {"description": string (3-4 sentences)}.',
};

export function buildProductDescriptionPrompt(
  name: string,
  context: string,
  audience: "layman" | "technical"
): { system: string; user: string } {
  return {
    system: PRODUCT_DESCRIPTION_SYSTEM_PROMPT[audience],
    user: `Product: ${name}\n\nWhat it actually contains: ${context}`,
  };
}

export async function generateProductDescription(
  name: string,
  context: string,
  audience: "layman" | "technical",
  provider: Provider
): Promise<GenerationResult> {
  const { system, user } = buildProductDescriptionPrompt(name, context, audience);
  const { text, inputTokens, outputTokens } = await callProvider(provider, system, user);
  const content = parseJsonContent(text, "Product-description model did not return valid JSON — check the prompt or retry.");
  return { content, inputTokens, outputTokens, provider, model: MODEL_PRICING_USD_PER_1M[provider].model };
}
