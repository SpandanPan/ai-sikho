import { describe, expect, it } from "vitest";
import { feedbackFor } from "./quizFeedback";

// Boundaries: >=90% Career-Ready, >=65% Builder in the Making,
// >=40% Everyday AI User, below that Curious Beginner. total=20 gives
// clean integer scores at each boundary (18, 13, 8).
describe("feedbackFor", () => {
  it("gives the career-ready message at a perfect score", () => {
    const f = feedbackFor(20, 20);
    expect(f.persona).toBe("Career-Ready");
    expect(f.headline).toMatch(/prepping for an AI role/i);
  });

  it("gives the career-ready message right at the 90% boundary", () => {
    expect(feedbackFor(18, 20).persona).toBe("Career-Ready");
  });

  it("gives the builder message just below the career boundary", () => {
    expect(feedbackFor(17, 20).persona).toBe("Builder in the Making");
  });

  it("gives the builder message right at the 65% boundary", () => {
    expect(feedbackFor(13, 20).persona).toBe("Builder in the Making");
  });

  it("gives the everyday-user message just below the builder boundary", () => {
    expect(feedbackFor(12, 20).persona).toBe("Everyday AI User");
  });

  it("gives the everyday-user message right at the 40% boundary", () => {
    expect(feedbackFor(8, 20).persona).toBe("Everyday AI User");
  });

  it("gives the beginner message just below the everyday-user boundary", () => {
    expect(feedbackFor(7, 20).persona).toBe("Curious Beginner");
  });

  it("gives the beginner message at a zero score", () => {
    expect(feedbackFor(0, 20).persona).toBe("Curious Beginner");
  });

  it("returns 5 starter links for every tier", () => {
    for (const score of [0, 8, 13, 20]) {
      expect(feedbackFor(score, 20).starters).toHaveLength(5);
    }
  });

  it("rejects a zero total instead of dividing by zero", () => {
    expect(() => feedbackFor(0, 0)).toThrow();
  });
});
