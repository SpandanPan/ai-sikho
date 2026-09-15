import { describe, expect, it } from "vitest";
import { hasFreeAttemptRemaining, isSameCalendarMonth, startOfMonth } from "./mockFeedbackQuota";

describe("isSameCalendarMonth", () => {
  it("is true for two dates in the same UTC month", () => {
    expect(isSameCalendarMonth(new Date("2026-09-01T00:00:00Z"), new Date("2026-09-30T23:00:00Z"))).toBe(true);
  });

  it("is false across a month boundary", () => {
    expect(isSameCalendarMonth(new Date("2026-08-31T23:00:00Z"), new Date("2026-09-01T00:00:00Z"))).toBe(false);
  });

  it("is false across a year boundary even if the month number matches", () => {
    expect(isSameCalendarMonth(new Date("2025-09-15T00:00:00Z"), new Date("2026-09-15T00:00:00Z"))).toBe(false);
  });
});

describe("startOfMonth", () => {
  it("returns midnight UTC on the 1st of the given date's month", () => {
    expect(startOfMonth(new Date("2026-09-14T18:30:00Z")).toISOString()).toBe("2026-09-01T00:00:00.000Z");
  });
});

describe("hasFreeAttemptRemaining", () => {
  it("allows a free attempt when there are none yet this month", () => {
    expect(hasFreeAttemptRemaining([], new Date("2026-09-14T00:00:00Z"))).toBe(true);
  });

  it("blocks a second free attempt in the same month", () => {
    const now = new Date("2026-09-14T00:00:00Z");
    expect(hasFreeAttemptRemaining([new Date("2026-09-02T00:00:00Z")], now)).toBe(false);
  });

  it("ignores a free attempt from a previous month", () => {
    const now = new Date("2026-09-14T00:00:00Z");
    expect(hasFreeAttemptRemaining([new Date("2026-08-20T00:00:00Z")], now)).toBe(true);
  });
});
