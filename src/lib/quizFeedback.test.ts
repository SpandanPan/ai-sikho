import { describe, expect, it } from "vitest";
import { feedbackFor } from "./quizFeedback";

describe("feedbackFor", () => {
  it("gives the top-tier message at a perfect score", () => {
    expect(feedbackFor(6, 6).headline).toMatch(/strong handle/i);
  });

  it("gives the top-tier message right at the 83% boundary", () => {
    expect(feedbackFor(5, 6).headline).toMatch(/strong handle/i);
  });

  it("gives the mid-tier message just below the top boundary", () => {
    expect(feedbackFor(4, 6).headline).toMatch(/myths worth unlearning/i);
  });

  it("gives the mid-tier message right at the 50% boundary", () => {
    expect(feedbackFor(3, 6).headline).toMatch(/myths worth unlearning/i);
  });

  it("gives the beginner message below 50%", () => {
    expect(feedbackFor(2, 6).headline).toMatch(/exactly who this site is for/i);
  });

  it("gives the beginner message at a zero score", () => {
    expect(feedbackFor(0, 6).headline).toMatch(/exactly who this site is for/i);
  });

  it("rejects a zero total instead of dividing by zero", () => {
    expect(() => feedbackFor(0, 0)).toThrow();
  });
});
