import { describe, expect, it } from "vitest";
import { buildPrompt, buildGradingPrompt } from "./contentAgent";

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
