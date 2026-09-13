import { describe, expect, it } from "vitest";
import { calculateGenerationCostInPaise, suggestedPriceInPaise, USD_TO_INR } from "./agentPricing";

describe("calculateGenerationCostInPaise", () => {
  it("computes cost from input and output tokens at the Anthropic rate", () => {
    // 1M input @ $2 + 1M output @ $10 = $12 -> * USD_TO_INR -> paise
    const cost = calculateGenerationCostInPaise("anthropic", 1_000_000, 1_000_000);
    expect(cost).toBe(Math.round(12 * USD_TO_INR * 100));
  });

  it("computes cost at the OpenAI rate, distinct from Anthropic's", () => {
    const anthropicCost = calculateGenerationCostInPaise("anthropic", 1000, 1000);
    const openaiCost = calculateGenerationCostInPaise("openai", 1000, 1000);
    expect(openaiCost).toBeGreaterThan(anthropicCost); // GPT flagship priced higher per the homepage cost table
  });

  it("returns 0 for zero tokens", () => {
    expect(calculateGenerationCostInPaise("anthropic", 0, 0)).toBe(0);
  });

  it("rejects negative token counts", () => {
    expect(() => calculateGenerationCostInPaise("anthropic", -1, 0)).toThrow();
  });
});

describe("suggestedPriceInPaise", () => {
  it("applies the default 3x margin", () => {
    expect(suggestedPriceInPaise(1000)).toBe(3000); // ₹10 cost -> ₹30 price, already a clean ₹10 multiple
  });

  it("rounds up to the nearest ₹10", () => {
    // ₹10.01 cost * 3 = ₹30.03 -> rounds up to ₹31.00... check it lands on a clean 10-paise-of-rupee boundary
    const price = suggestedPriceInPaise(1001, 3);
    expect(price % 1000).toBe(0);
    expect(price).toBeGreaterThanOrEqual(1001 * 3);
  });

  it("respects a custom margin multiplier", () => {
    expect(suggestedPriceInPaise(1000, 5)).toBe(5000);
  });

  it("rejects a negative cost", () => {
    expect(() => suggestedPriceInPaise(-1)).toThrow();
  });
});
