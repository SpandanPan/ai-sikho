import { describe, expect, it } from "vitest";
import { scoreRelevance, rankDocs } from "./ragScore";

describe("scoreRelevance", () => {
  it("scores 0 when no meaningful words overlap", () => {
    expect(scoreRelevance("how do refunds work", "Course access is permanent.")).toBe(0);
  });

  it("scores higher when more query words are present in the text", () => {
    const partial = scoreRelevance("refunds and payments", "Refunds are handled within 7 days.");
    const full = scoreRelevance("refunds and payments", "Refunds and payments are both handled promptly.");
    expect(full).toBeGreaterThan(partial);
  });

  it("ignores stopwords so they don't inflate the score", () => {
    // "how", "do", "i", "the" are all stopwords — only "refunds" counts.
    expect(scoreRelevance("how do i the refunds", "Refunds are available.")).toBe(1);
  });

  it("returns 0 for an empty, all-stopword question rather than dividing by zero", () => {
    expect(scoreRelevance("how do the", "anything at all")).toBe(0);
  });
});

describe("rankDocs", () => {
  const docs = [
    { id: "refunds", text: "Refunds are available within 7 days." },
    { id: "support", text: "Email support for any other question." },
  ];

  it("ranks the more relevant document first", () => {
    const ranked = rankDocs("how do refunds work", docs);
    expect(ranked[0].id).toBe("refunds");
  });

  it("preserves every document in the result, just reordered", () => {
    const ranked = rankDocs("support question", docs);
    expect(ranked.map((d) => d.id).sort()).toEqual(["refunds", "support"]);
  });
});
