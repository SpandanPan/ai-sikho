// Admin-triggered content generation drafts — never auto-published. A human
// reviews resultJson and only then does it get copied into the real
// quizQuestions.ts / articles.ts / PathwayPhase data. This mirrors the
// "questions must be written fresh, quality over quantity" standard the
// rest of this product holds itself to — an AI-generated draft doesn't get
// to skip that review just because a machine wrote it first.
//
// Two providers on purpose (Claude via Anthropic, GPT via OpenAI) — pick
// whichever the admin prefers per job, useful for comparing quality/cost or
// having a fallback if one provider is down. Requires ANTHROPIC_API_KEY
// and/or OPENAI_API_KEY. Neither is set in this environment, so this code
// path is unverified — written against each provider's documented API
// contract, but not actually run against a real key. Test it once a key is
// available before trusting its output.
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

export async function generateContent(type: GenerationType, topic: string, provider: Provider): Promise<GenerationResult> {
  const { system, user } = buildPrompt(type, topic);

  const { text, inputTokens, outputTokens } =
    provider === "anthropic" ? await callAnthropic(system, user) : await callOpenAi(system, user);

  let content: unknown;
  try {
    content = JSON.parse(text);
  } catch {
    throw new ContentAgentError("Model did not return valid JSON — check the prompt or retry.");
  }

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

  const { text, inputTokens, outputTokens } =
    provider === "anthropic" ? await callAnthropic(system, user) : await callOpenAi(system, user);

  let content: unknown;
  try {
    content = JSON.parse(text);
  } catch {
    throw new ContentAgentError("Grading model did not return valid JSON — check the prompt or retry.");
  }

  return { content, inputTokens, outputTokens, provider, model: MODEL_PRICING_USD_PER_1M[provider].model };
}
