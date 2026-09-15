// What it actually costs to run a content-generation agent, and what to
// charge for it if/when this becomes a customer-facing feature rather than
// an internal admin tool. Kept as pure math, separate from the API call
// itself, so the pricing logic is testable and auditable on its own.

export type Provider = "anthropic" | "openai" | "ollama";

// USD per 1,000,000 tokens — same figures already shown on the homepage's
// "What It Costs" section, kept in sync deliberately (one product, one set
// of numbers). Re-check against the provider's current pricing page before
// relying on this for real invoicing; API pricing changes.
//
// "ollama" is $0 per token by construction — there's no per-request bill,
// it's your own hardware. That's not the same as free: see AGENT_COSTS.md
// for the real trade-off (weaker model quality, plus it must actually be
// reachable from wherever the calling code runs — see contentAgent.ts).
//
// Default model is gemma4:e4b, not because it's necessarily the best
// open-weight option (Qwen2.5 and DeepSeek's smaller models are also
// strong, sometimes stronger, choices) but because it's the one already
// pulled and verified against this project's actual prompts — no reason to
// spend more disk/bandwidth speculatively pulling alternatives before
// there's a concrete quality gap to fix. Override with OLLAMA_MODEL if you
// pull something else later.
export const MODEL_PRICING_USD_PER_1M: Record<Provider, { input: number; output: number; model: string }> = {
  anthropic: { input: 2, output: 10, model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5" },
  openai: { input: 5, output: 30, model: process.env.OPENAI_MODEL ?? "gpt-6" },
  ollama: { input: 0, output: 0, model: process.env.OLLAMA_MODEL ?? "gemma4:e4b" },
};

// Approximate, and it moves daily — this is a planning estimate for margin
// calculation, not a number to bill a customer in USD off of. Override via
// env if you want a more current rate without a code change.
export const USD_TO_INR = Number(process.env.USD_TO_INR_RATE ?? "83");

// Retail price = 3x raw API cost. Covers overhead (review time, hosting,
// payment fees) beyond just the token spend — a real business needs margin
// on top of COGS, not just cost-recovery.
export const MARGIN_MULTIPLIER = 3;

export function calculateGenerationCostInPaise(provider: Provider, inputTokens: number, outputTokens: number): number {
  if (inputTokens < 0 || outputTokens < 0) throw new Error("token counts must not be negative");
  const pricing = MODEL_PRICING_USD_PER_1M[provider];
  const costUsd = (inputTokens / 1_000_000) * pricing.input + (outputTokens / 1_000_000) * pricing.output;
  const costInr = costUsd * USD_TO_INR;
  return Math.round(costInr * 100); // rupees -> paise
}

export function suggestedPriceInPaise(costInPaise: number, marginMultiplier: number = MARGIN_MULTIPLIER): number {
  if (costInPaise < 0) throw new Error("costInPaise must not be negative");
  // Round up to the nearest ₹10 — a clean, impulse-buy-friendly price point
  // rather than an odd number like ₹47.32.
  const raw = costInPaise * marginMultiplier;
  return Math.ceil(raw / 1000) * 1000;
}
