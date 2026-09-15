import { describe, expect, it } from "vitest";
import { validateTerm, evergreenTermForDay, EVERGREEN_TERMS } from "./termOfDay";

describe("validateTerm", () => {
  it("accepts a well-formed term and trims whitespace", () => {
    expect(validateTerm({ term: " RAG ", definition: " Retrieval then generation. " })).toEqual({
      term: "RAG",
      definition: "Retrieval then generation.",
    });
  });

  it("rejects a missing definition", () => {
    expect(validateTerm({ term: "RAG" })).toBeNull();
  });

  it("rejects an empty term", () => {
    expect(validateTerm({ term: "  ", definition: "x" })).toBeNull();
  });

  it("rejects a definition that rambled past the length guard", () => {
    expect(validateTerm({ term: "RAG", definition: "x".repeat(500) })).toBeNull();
  });

  it("rejects non-object input", () => {
    expect(validateTerm("not an object")).toBeNull();
    expect(validateTerm(null)).toBeNull();
  });
});

describe("evergreenTermForDay", () => {
  it("returns a term from the fixed evergreen set", () => {
    const term = evergreenTermForDay(new Date("2026-09-15T00:00:00Z"));
    expect(EVERGREEN_TERMS).toContainEqual(term);
  });

  it("returns a different term on a different day (assuming set size > 1)", () => {
    const a = evergreenTermForDay(new Date("2026-01-01T00:00:00Z"));
    const b = evergreenTermForDay(new Date("2026-01-02T00:00:00Z"));
    expect(a).not.toEqual(b);
  });

  it("is deterministic for the same day", () => {
    const a = evergreenTermForDay(new Date("2026-09-15T03:00:00Z"));
    const b = evergreenTermForDay(new Date("2026-09-15T21:00:00Z"));
    expect(a).toEqual(b);
  });
});
