import { describe, expect, it } from "vitest";
import { checkIdentifierRateLimit, checkIpRateLimit } from "./rateLimit";

const now = new Date("2026-09-13T12:00:00Z");
const secondsAgo = (s: number) => new Date(now.getTime() - s * 1000);
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60 * 1000);

describe("checkIdentifierRateLimit", () => {
  it("allows the first request with no history", () => {
    expect(checkIdentifierRateLimit([], now)).toEqual({ allowed: true });
  });

  it("blocks a second request within the cooldown window", () => {
    expect(checkIdentifierRateLimit([secondsAgo(10)], now).allowed).toBe(false);
  });

  it("allows a request right after the cooldown passes", () => {
    expect(checkIdentifierRateLimit([secondsAgo(31)], now).allowed).toBe(true);
  });

  it("blocks once the per-window cap is hit, even outside the cooldown", () => {
    const history = [minutesAgo(1), minutesAgo(5), minutesAgo(10)]; // 3 within 15 min
    expect(checkIdentifierRateLimit(history, now, 3).allowed).toBe(false);
  });

  it("allows again once old requests age out of the window", () => {
    const history = [minutesAgo(20), minutesAgo(25)];
    expect(checkIdentifierRateLimit(history, now, 3).allowed).toBe(true);
  });

  it("respects a custom max and window size", () => {
    const history = [minutesAgo(3)];
    expect(checkIdentifierRateLimit(history, now, 1, 5).allowed).toBe(false);
    expect(checkIdentifierRateLimit(history, now, 1, 2).allowed).toBe(true);
  });
});

describe("checkIpRateLimit", () => {
  it("has NO cooldown between requests — two requests seconds apart are both fine", () => {
    // This is the bug this split fixed: an IP-wide cooldown would block a
    // stranger on the same network (mobile NAT) moments after someone
    // else's unrelated request.
    expect(checkIpRateLimit([secondsAgo(1)], now).allowed).toBe(true);
  });

  it("allows requests under the per-window cap", () => {
    const history = [secondsAgo(5), secondsAgo(10)];
    expect(checkIpRateLimit(history, now, 10).allowed).toBe(true);
  });

  it("blocks once the per-window cap is hit", () => {
    const history = Array.from({ length: 10 }, (_, i) => secondsAgo(i));
    expect(checkIpRateLimit(history, now, 10).allowed).toBe(false);
  });

  it("allows again once old requests age out of the window", () => {
    const history = [minutesAgo(20)];
    expect(checkIpRateLimit(history, now, 1, 15).allowed).toBe(true);
  });
});
