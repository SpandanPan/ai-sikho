export const DAILY_QUIZ_SIZE = 10;

// Broad on purpose — the daily cron asks for a mix, not one narrow topic,
// so this doubles as the "topic" argument to contentAgent's generateContent
// (which is normally about one specific subject).
export const DAILY_QUIZ_TOPIC =
  `Generate exactly ${DAILY_QUIZ_SIZE} varied, broad, getting-started AI/GenAI literacy questions — ` +
  "no two on the same narrow fact. Mix across: what AI actually is, hallucination, RAG, AI agents vs " +
  "chatbots, local vs paid models, prompting basics, context windows/memory, and AI ethics basics.";

export type DailyQuizQuestion = {
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
};

function isValidQuestion(q: unknown): q is DailyQuizQuestion {
  if (typeof q !== "object" || q === null) return false;
  const r = q as Record<string, unknown>;
  return (
    typeof r.question === "string" &&
    r.question.trim().length > 0 &&
    Array.isArray(r.options) &&
    r.options.length === 4 &&
    r.options.every((o) => typeof o === "string" && o.trim().length > 0) &&
    Number.isInteger(r.correctIdx) &&
    (r.correctIdx as number) >= 0 &&
    (r.correctIdx as number) <= 3 &&
    typeof r.explanation === "string" &&
    r.explanation.trim().length > 0
  );
}

// Never trust unreviewed model output blindly, especially for something
// with a scored "correct" answer — a wrong answer marked correct is a real
// credibility problem, worse than a mediocre free grading. Returns null
// (triggering the fallback to the curated set) rather than partial/bad
// data on anything short of a clean, fully-valid set of exactly
// DAILY_QUIZ_SIZE questions.
export function validateDailyQuiz(content: unknown): DailyQuizQuestion[] | null {
  if (!Array.isArray(content)) return null;
  const valid = content.filter(isValidQuestion);
  if (valid.length < DAILY_QUIZ_SIZE) return null;
  return valid.slice(0, DAILY_QUIZ_SIZE);
}
