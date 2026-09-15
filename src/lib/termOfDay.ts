export type Term = { term: string; definition: string };

const MAX_DEFINITION_LENGTH = 400; // guard against the model rambling despite the "1-2 sentences" instruction

function isValidTerm(content: unknown): content is Term {
  if (typeof content !== "object" || content === null) return false;
  const r = content as Record<string, unknown>;
  return (
    typeof r.term === "string" &&
    r.term.trim().length > 0 &&
    r.term.length <= 60 &&
    typeof r.definition === "string" &&
    r.definition.trim().length > 0 &&
    r.definition.length <= MAX_DEFINITION_LENGTH
  );
}

export function validateTerm(content: unknown): Term | null {
  return isValidTerm(content) ? { term: content.term.trim(), definition: content.definition.trim() } : null;
}

// Evergreen fallback if today's row is missing (cron hasn't run yet, or
// generation failed validation) — picked deterministically by day-of-year
// so it still changes daily even in the worst case, rather than always
// showing the same one.
export const EVERGREEN_TERMS: Term[] = [
  { term: "Token", definition: "The chunk of text (often a word piece) a model reads and writes one unit at a time — pricing and context limits are measured in tokens, not words or characters." },
  { term: "Context window", definition: "How much text a model can \"see\" at once for a given request — everything outside it is simply invisible to that response, not remembered or forgotten." },
  { term: "Fine-tuning", definition: "Further training an existing model on your own examples so it leans toward a specific style or task — different from prompting, which shapes behavior at request time with no retraining." },
  { term: "Embedding", definition: "A list of numbers representing a piece of text's meaning, positioned so similar meanings end up close together — the basis for semantic search and RAG." },
  { term: "Temperature", definition: "A setting that controls how random a model's word choices are — low temperature gives more predictable, repeatable answers; high temperature gives more varied, creative ones." },
  { term: "Prompt injection", definition: "Feeding a model text designed to override its original instructions — a real security concern for any AI system that reads untrusted input, like a webpage or an email." },
  { term: "Inference", definition: "Actually running a trained model to produce an answer — as opposed to training, which is the (much more expensive) process of building the model in the first place." },
];

export function evergreenTermForDay(now: Date = new Date()): Term {
  const dayOfYear = Math.floor(
    (Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - Date.UTC(now.getUTCFullYear(), 0, 0)) /
      86_400_000
  );
  return EVERGREEN_TERMS[dayOfYear % EVERGREEN_TERMS.length];
}
