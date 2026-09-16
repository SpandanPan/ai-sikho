// Same pattern as quizQuestions.ts: hardcoded for v0, mirrors the Course
// table shape so this can move to a DB read later with no page changes.

export type Course = {
  slug: string;
  title: string;
  summary: string;
  priceInPaise: number; // 0 = free
  hasDemo: boolean;
  // "technical" = the original engineering-skills set, aimed at people
  // prepping for an AI/GenAI engineering role. "fluency" = a distinct
  // audience — non-technical professionals who want to use AI well in
  // their current job, not become engineers. No code, no interview prep
  // framing; deliberately not folded into the Interview Pack tracks,
  // which are all role-based engineering prep. Same Course/cart/checkout
  // machinery either way — this is a content/positioning split, not a
  // technical one.
  category: "technical" | "fluency";
};

export const courses: Course[] = [
  {
    slug: "git-basics",
    title: "Git Basics",
    summary: "Commits, branches, and pull requests — the workflow every engineering team assumes you already know.",
    priceInPaise: 0,
    hasDemo: false,
    category: "technical",
  },
  {
    slug: "python-basics",
    title: "Python Basics",
    summary: "Enough Python to call an API, handle errors, and structure a small project — not a full CS course.",
    priceInPaise: 0,
    hasDemo: false,
    category: "technical",
  },
  {
    slug: "rag-basics",
    title: "RAG Basics",
    summary: "How retrieval-augmented generation actually works, with a live mini-demo you can query yourself.",
    priceInPaise: 14900, // ₹149
    hasDemo: true,
    category: "technical",
  },
  {
    slug: "knowledge-graphs",
    title: "Knowledge Graphs for AI",
    summary: "When a graph beats a vector index, and how graph-based retrieval changes what an agent can answer.",
    priceInPaise: 14900, // ₹149
    hasDemo: false,
    category: "technical",
  },
  {
    slug: "llm-observability",
    title: "LLM Observability",
    summary: "What to actually monitor once an LLM feature is live — tracing, evals, cost, and drift.",
    priceInPaise: 19900, // ₹199
    hasDemo: false,
    category: "technical",
  },
  {
    slug: "ai-fluency-basics",
    title: "AI Fluency: What It Actually Is",
    summary: "No code. What today's AI genuinely can and can't do, in plain language — the myths that waste people's time, cleared up in one sitting.",
    priceInPaise: 0,
    hasDemo: false,
    category: "fluency",
  },
  {
    slug: "prompting-that-works",
    title: "Prompting That Actually Works",
    summary: "Why most people's prompts get mediocre answers, and the handful of habits that reliably get better ones — for any AI chatbot, not one specific tool.",
    priceInPaise: 9900, // ₹99 — priced for a price-sensitive, non-technical audience, not the engineering-track rate
    hasDemo: false,
    category: "fluency",
  },
  {
    slug: "ai-for-your-job",
    title: "AI for Your Job, Not a Coding Job",
    summary: "Using AI well for writing, research, analysis, and admin work — concrete before/after examples across marketing, HR, ops, and finance tasks.",
    priceInPaise: 9900, // ₹99
    hasDemo: false,
    category: "fluency",
  },
  {
    slug: "ai-fluency-mistakes",
    title: "The Mistakes That Get People in Trouble",
    summary: "Sharing the wrong data with a chatbot, trusting a confidently wrong answer, and other real, avoidable mistakes — what to actually check before you hit send.",
    priceInPaise: 9900, // ₹99
    hasDemo: false,
    category: "fluency",
  },
];

export function formatPrice(paise: number) {
  if (paise === 0) return "Free";
  return `₹${(paise / 100).toFixed(0)}`;
}
