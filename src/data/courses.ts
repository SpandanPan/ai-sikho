// Same pattern as quizQuestions.ts: hardcoded for v0, mirrors the Course
// table shape so this can move to a DB read later with no page changes.

export type Course = {
  slug: string;
  title: string;
  summary: string;
  priceInPaise: number; // 0 = free
  hasDemo: boolean;
};

export const courses: Course[] = [
  {
    slug: "git-basics",
    title: "Git Basics",
    summary: "Commits, branches, and pull requests — the workflow every engineering team assumes you already know.",
    priceInPaise: 0,
    hasDemo: false,
  },
  {
    slug: "python-basics",
    title: "Python Basics",
    summary: "Enough Python to call an API, handle errors, and structure a small project — not a full CS course.",
    priceInPaise: 0,
    hasDemo: false,
  },
  {
    slug: "rag-basics",
    title: "RAG Basics",
    summary: "How retrieval-augmented generation actually works, with a live mini-demo you can query yourself.",
    priceInPaise: 14900, // ₹149
    hasDemo: true,
  },
  {
    slug: "knowledge-graphs",
    title: "Knowledge Graphs for AI",
    summary: "When a graph beats a vector index, and how graph-based retrieval changes what an agent can answer.",
    priceInPaise: 14900, // ₹149
    hasDemo: false,
  },
  {
    slug: "llm-observability",
    title: "LLM Observability",
    summary: "What to actually monitor once an LLM feature is live — tracing, evals, cost, and drift.",
    priceInPaise: 19900, // ₹199
    hasDemo: false,
  },
];

export function formatPrice(paise: number) {
  if (paise === 0) return "Free";
  return `₹${(paise / 100).toFixed(0)}`;
}
