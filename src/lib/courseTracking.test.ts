import { describe, expect, it } from "vitest";
import { isValidPercent, isValidRating, isCompleting } from "./courseTracking";

describe("isValidPercent", () => {
  it("accepts integers from 0 to 100", () => {
    expect(isValidPercent(0)).toBe(true);
    expect(isValidPercent(50)).toBe(true);
    expect(isValidPercent(100)).toBe(true);
  });

  it("rejects out-of-range values", () => {
    expect(isValidPercent(-1)).toBe(false);
    expect(isValidPercent(101)).toBe(false);
  });

  it("rejects non-integers and non-numbers", () => {
    expect(isValidPercent(50.5)).toBe(false);
    expect(isValidPercent("50")).toBe(false);
    expect(isValidPercent(null)).toBe(false);
  });
});

describe("isValidRating", () => {
  it("accepts integers 1 through 5", () => {
    for (let i = 1; i <= 5; i++) expect(isValidRating(i)).toBe(true);
  });

  it("rejects 0, 6, and non-integers", () => {
    expect(isValidRating(0)).toBe(false);
    expect(isValidRating(6)).toBe(false);
    expect(isValidRating(3.5)).toBe(false);
  });
});

describe("isCompleting", () => {
  it("is true only on the transition into 100", () => {
    expect(isCompleting(80, 100)).toBe(true);
  });

  it("is false if already at 100", () => {
    expect(isCompleting(100, 100)).toBe(false);
  });

  it("is false for any non-100 target", () => {
    expect(isCompleting(0, 50)).toBe(false);
  });
});
