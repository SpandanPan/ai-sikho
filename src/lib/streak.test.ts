import { describe, expect, it } from "vitest";
import { computeStreak } from "./streak";

describe("computeStreak", () => {
  it("returns zeros for no active days", () => {
    expect(computeStreak([])).toEqual({ current: 0, longest: 0 });
  });

  it("a single active day today is a streak of 1", () => {
    expect(computeStreak(["2026-09-14"], "2026-09-14")).toEqual({ current: 1, longest: 1 });
  });

  it("counts 3 consecutive days ending today as a current streak of 3", () => {
    const result = computeStreak(["2026-09-12", "2026-09-13", "2026-09-14"], "2026-09-14");
    expect(result.current).toBe(3);
    expect(result.longest).toBe(3);
  });

  it("still counts as current if the last active day was yesterday (hasn't visited yet today)", () => {
    const result = computeStreak(["2026-09-12", "2026-09-13"], "2026-09-14");
    expect(result.current).toBe(2);
  });

  it("breaks the current streak if the last active day was 2+ days ago", () => {
    const result = computeStreak(["2026-09-10", "2026-09-11"], "2026-09-14");
    expect(result.current).toBe(0);
    expect(result.longest).toBe(2); // history is preserved even though current is broken
  });

  it("only counts the most recent run as current, even if an earlier run was longer", () => {
    // Days 1-5 straight (longest=5), then a gap, then just today (current=1).
    const result = computeStreak(
      ["2026-09-01", "2026-09-02", "2026-09-03", "2026-09-04", "2026-09-05", "2026-09-14"],
      "2026-09-14"
    );
    expect(result.current).toBe(1);
    expect(result.longest).toBe(5);
  });

  it("ignores duplicate entries for the same day", () => {
    const result = computeStreak(["2026-09-14", "2026-09-14", "2026-09-13"], "2026-09-14");
    expect(result.current).toBe(2);
  });

  it("ignores day order in the input", () => {
    const result = computeStreak(["2026-09-14", "2026-09-12", "2026-09-13"], "2026-09-14");
    expect(result.current).toBe(3);
  });
});
