// Pulled out of RagDemo.tsx so the retrieval scoring logic is unit-testable
// without rendering React. Deliberately simple keyword overlap, not real
// embeddings — the demo teaches the retrieve-then-generate shape, not vector
// search.
const STOPWORDS = new Set([
  "how", "do", "does", "the", "a", "an", "is", "are", "i", "to", "for", "of", "on", "in", "my", "can", "what",
]);

export function scoreRelevance(question: string, text: string): number {
  const qWords = question.toLowerCase().match(/[a-z]+/g)?.filter((w) => !STOPWORDS.has(w)) ?? [];
  const tWords = new Set(text.toLowerCase().match(/[a-z]+/g) ?? []);
  const hits = qWords.filter((w) => tWords.has(w)).length;
  return qWords.length ? hits / qWords.length : 0;
}

export type Doc = { id: string; text: string };

export function rankDocs(question: string, docs: Doc[]) {
  return docs
    .map((d) => ({ ...d, score: scoreRelevance(question, d.text) }))
    .sort((a, b) => b.score - a.score);
}
