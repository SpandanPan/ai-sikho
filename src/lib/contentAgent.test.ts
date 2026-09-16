import { describe, expect, it } from "vitest";
import { buildPrompt, buildGradingPrompt, buildTakeawayPrompt, buildTermPrompt, buildProductDescriptionPrompt, extractJsonText } from "./contentAgent";

describe("buildPrompt", () => {
  it("includes the topic in the user message", () => {
    const { user } = buildPrompt("QUIZ", "attention mechanisms");
    expect(user).toContain("attention mechanisms");
  });

  it("gives each content type a distinct system prompt", () => {
    const quiz = buildPrompt("QUIZ", "x").system;
    const article = buildPrompt("ARTICLE", "x").system;
    const roadmap = buildPrompt("ROADMAP", "x").system;
    expect(quiz).not.toBe(article);
    expect(article).not.toBe(roadmap);
  });

  it("instructs the quiz prompt to require original, non-copied questions", () => {
    expect(buildPrompt("QUIZ", "x").system.toLowerCase()).toContain("original");
  });
});

describe("buildGradingPrompt", () => {
  it("includes the category, question, and answer in the user message", () => {
    const { user } = buildGradingPrompt("system-design", "Design a RAG pipeline.", "I would chunk the docs...");
    expect(user).toContain("system-design");
    expect(user).toContain("Design a RAG pipeline.");
    expect(user).toContain("I would chunk the docs...");
  });

  it("instructs the grader to be specific rather than generically encouraging", () => {
    expect(buildGradingPrompt("x", "x", "x").system.toLowerCase()).toContain("specific");
  });

  it("uses a distinct system prompt from the content-drafting agents", () => {
    const grading = buildGradingPrompt("x", "x", "x").system;
    const quiz = buildPrompt("QUIZ", "x").system;
    expect(grading).not.toBe(quiz);
  });
});

describe("buildTakeawayPrompt", () => {
  it("includes the headline and summary, never a full article", () => {
    const { system, user } = buildTakeawayPrompt("Model X ships tool use", "Adds function calling.");
    expect(user).toContain("Model X ships tool use");
    expect(user).toContain("Adds function calling.");
    expect(system.toLowerCase()).toContain("never the full article");
  });
});

describe("buildTermPrompt", () => {
  it("asks the model to avoid terms already covered", () => {
    const { user } = buildTermPrompt(["RAG", "hallucination"]);
    expect(user).toContain("RAG");
    expect(user).toContain("hallucination");
  });

  it("gives an open prompt when there's no history yet", () => {
    const { user } = buildTermPrompt([]);
    expect(user.toLowerCase()).toContain("any genuinely useful term");
  });
});

describe("buildProductDescriptionPrompt", () => {
  it("uses plain-English framing for a layman audience", () => {
    const { system } = buildProductDescriptionPrompt("Starter Pack", "25 questions", "layman");
    expect(system.toLowerCase()).toContain("plain english");
    expect(system.toLowerCase()).toContain("zero jargon");
  });

  it("uses a technical framing for a technical audience", () => {
    const { system } = buildProductDescriptionPrompt("RAG Basics", "a live demo", "technical");
    expect(system.toLowerCase()).toContain("technical terms");
  });

  it("includes the product name and context in the user message", () => {
    const { user } = buildProductDescriptionPrompt("Agentic AI Kit", "90 questions, 25 scenarios", "technical");
    expect(user).toContain("Agentic AI Kit");
    expect(user).toContain("90 questions, 25 scenarios");
  });
});

describe("extractJsonText", () => {
  it("strips a ```json fenced block, as returned by a real local Ollama model", () => {
    const raw = '```json\n[{"question": "x"}]\n```';
    expect(extractJsonText(raw)).toBe('[{"question": "x"}]');
  });

  it("strips a bare fence with no language tag", () => {
    const raw = '```\n{"a": 1}\n```';
    expect(extractJsonText(raw)).toBe('{"a": 1}');
  });

  it("passes unfenced JSON through unchanged, aside from trimming", () => {
    expect(extractJsonText('  {"a": 1}  ')).toBe('{"a": 1}');
  });
});
