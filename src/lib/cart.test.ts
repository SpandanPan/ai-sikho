import { describe, expect, it } from "vitest";
import { resolveCartItem, calculateCartSubtotal, distributeDiscount } from "./cart";

describe("resolveCartItem", () => {
  it("resolves a real course to its real price, ignoring any client-sent price", () => {
    const item = resolveCartItem({ type: "course", slug: "rag-basics" });
    expect(item).not.toBeNull();
    expect(item!.amountInPaise).toBe(14900);
    expect(item!.product).toBe("COURSE");
  });

  it("returns null for a free course — nothing to check out", () => {
    expect(resolveCartItem({ type: "course", slug: "git-basics" })).toBeNull();
  });

  it("returns null for an unknown course slug", () => {
    expect(resolveCartItem({ type: "course", slug: "does-not-exist" })).toBeNull();
  });

  it("resolves a pack starter to its track's starter price", () => {
    const item = resolveCartItem({ type: "pack-starter", slug: "agentic-ai" });
    expect(item).not.toBeNull();
    expect(item!.amountInPaise).toBe(10000);
    expect(item!.product).toBe("STARTER_PACK");
    expect(item!.packTrack).toBe("agentic-ai");
  });

  it("resolves a pack kit to its track's kit price", () => {
    const item = resolveCartItem({ type: "pack-kit", slug: "data-scientist" });
    expect(item).not.toBeNull();
    expect(item!.amountInPaise).toBe(99900);
    expect(item!.product).toBe("INTERVIEW_KIT");
  });

  it("returns null for an unknown pack track", () => {
    expect(resolveCartItem({ type: "pack-kit", slug: "does-not-exist" })).toBeNull();
  });
});

describe("calculateCartSubtotal", () => {
  it("sums item amounts", () => {
    expect(calculateCartSubtotal([{ amountInPaise: 10000 }, { amountInPaise: 99900 }])).toBe(109900);
  });

  it("returns 0 for an empty cart", () => {
    expect(calculateCartSubtotal([])).toBe(0);
  });
});

describe("distributeDiscount", () => {
  it("splits proportionally to each item's share of the subtotal", () => {
    const items = [{ amountInPaise: 10000 }, { amountInPaise: 90000 }]; // 10%/90% split
    const shares = distributeDiscount(items, 1000);
    expect(shares).toEqual([100, 900]);
  });

  it("sums exactly to the total discount even with rounding-prone splits", () => {
    const items = [{ amountInPaise: 10000 }, { amountInPaise: 10000 }, { amountInPaise: 10000 }];
    const shares = distributeDiscount(items, 100); // 33.33 each, must still sum to exactly 100
    expect(shares.reduce((a, b) => a + b, 0)).toBe(100);
  });

  it("returns an empty array for an empty cart", () => {
    expect(distributeDiscount([], 500)).toEqual([]);
  });

  it("returns all zeros when the subtotal is zero", () => {
    expect(distributeDiscount([{ amountInPaise: 0 }, { amountInPaise: 0 }], 500)).toEqual([0, 0]);
  });
});
