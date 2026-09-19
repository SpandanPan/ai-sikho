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
  // Longer product-page copy, drafted by the local Ollama agent
  // (scripts/generate-product-descriptions.ts), reviewed by hand — same
  // standard as every other AI-drafted content in this app. Technical
  // courses get technical language; fluency courses get plain language.
  description: string;
};

export const courses: Course[] = [
  {
    slug: "git-basics",
    title: "Git Basics",
    summary: "Commits, branches, and pull requests — the workflow every engineering team assumes you already know.",
    priceInPaise: 0,
    hasDemo: false,
    category: "technical",
    description: "A comprehensive deep dive into the fundamental collaborative toolkit of modern software development. We move beyond basic commands, mastering the full lifecycle of commits, branching strategies, and the rigorous workflow of pull requests. Proficiency in these core concepts is non-negotiable — mastering this material directly addresses the collaborative-workflow assumptions tested in every major AI/ML engineering interview.",
  },
  {
    slug: "python-basics",
    title: "Python Basics",
    summary: "Enough Python to call an API, handle errors, and structure a small project — not a full CS course.",
    priceInPaise: 0,
    hasDemo: false,
    category: "technical",
    description: "Skip the academic fluff and focus on production-ready implementation. This covers the critical Python scaffolding needed to efficiently structure small, system-integrated applications — making robust API calls, managing asynchronous payloads, and implementing comprehensive error handling (request timeouts, status-code validation). Designed to get you past the \"Hello World\" stage and immediately competent with the mechanics a technical screening or job-day task actually requires.",
  },
  {
    slug: "rag-basics",
    title: "RAG Basics",
    summary: "How retrieval-augmented generation actually works, with a live mini-demo you can query yourself.",
    priceInPaise: 14900, // ₹149
    hasDemo: true,
    category: "technical",
    description: "This module deconstructs the core architecture of Retrieval-Augmented Generation, moving beyond conceptual understanding to functional mechanics — chunking strategies, vector databases, query embedding, and context grounding. The included interactive demo lets you trace the entire process from user query to final grounded response, which is exactly what you need to be able to articulate in a system-design interview.",
  },
  {
    slug: "knowledge-graphs",
    title: "Knowledge Graphs for AI",
    summary: "When a graph beats a vector index, and how graph-based retrieval changes what an agent can answer.",
    priceInPaise: 14900, // ₹149
    hasDemo: false,
    category: "technical",
    description: "This deep dive tackles the critical architectural comparison: when knowledge graphs provide structure that a vector index can't match. You'll learn how traversing relationships, rather than just similarity, fundamentally changes what question-answering an AI agent can actually do — a distinction that matters directly in advanced system-design interviews, letting you propose RAG architectures that go beyond a simple embedding lookup.",
  },
  {
    slug: "llm-observability",
    title: "LLM Observability",
    summary: "What to actually monitor once an LLM feature is live — tracing, evals, cost, and drift.",
    priceInPaise: 19900, // ₹199
    hasDemo: false,
    category: "technical",
    description: "Transitioning an LLM feature from staging to production requires holistic monitoring beyond simple uptime checks. This covers deep prompt tracing and latency analysis to pinpoint bottlenecks within complex chains, plus systematic evaluation pipelines to monitor quality metrics and detect the data/model drift that quietly degrades performance over time. Mastering these observability layers, alongside cost attribution, is non-negotiable for designing production-ready GenAI systems.",
  },
  {
    slug: "ai-fluency-basics",
    title: "AI Fluency: What It Actually Is",
    summary: "No code. What today's AI genuinely can and can't do, in plain language — the myths that waste people's time, cleared up in one sitting.",
    priceInPaise: 0,
    hasDemo: false,
    category: "fluency",
    description: "Tired of vague articles and overwhelming hype? This course strips away the jargon, teaching you what artificial intelligence actually is and how it can help you — without ever writing a single line of code. You'll gain real confidence in AI's actual strengths and limitations, leaving you fluent enough to apply these tools to problems in your own work or life.",
  },
  {
    slug: "prompting-that-works",
    title: "Prompting That Actually Works",
    summary: "Why most people's prompts get mediocre answers, and the handful of habits that reliably get better ones — for any AI chatbot, not one specific tool.",
    priceInPaise: 9900, // ₹99 — priced for a price-sensitive, non-technical audience, not the engineering-track rate
    hasDemo: false,
    category: "fluency",
    description: "Frustrated that your questions to AI chatbots always get mediocre answers? This course teaches the handful of habits that reliably get better results, no matter which tool you're using — how to guide the AI rather than just asking it something, so it becomes a reliable partner for your work instead of a slot machine.",
  },
  {
    slug: "ai-for-your-job",
    title: "AI for Your Job, Not a Coding Job",
    summary: "Using AI well for writing, research, analysis, and admin work — concrete before/after examples across marketing, HR, ops, and finance tasks.",
    priceInPaise: 9900, // ₹99
    hasDemo: false,
    category: "fluency",
    description: "Stop learning technical skills and start mastering your actual job. This teaches you to use AI tools for real workplace tasks — drafting reports, analyzing data, organizing HR manuals — with practical, step-by-step examples across marketing, HR, ops, and finance. No code, just concrete ways to get faster and better at the work you already do.",
  },
  {
    slug: "ai-fluency-mistakes",
    title: "The Mistakes That Get People in Trouble",
    summary: "Sharing the wrong data with a chatbot, trusting a confidently wrong answer, and other real, avoidable mistakes — what to actually check before you hit send.",
    priceInPaise: 9900, // ₹99
    hasDemo: false,
    category: "fluency",
    description: "Unsure what to trust when talking to a chatbot? This course gives you the essential skills to use AI confidently and safely — the real mistakes people actually make, like sharing private information or believing bad advice, and exactly how to check an AI's answer before you rely on it.",
  },
  {
    slug: "ai-tools-to-try",
    title: "AI Tools You Can Start Using Today",
    summary: "Five real tools, no cost to try any of them, with exact steps to get started and a concrete way to use each one for your own work.",
    priceInPaise: 0,
    hasDemo: false,
    category: "fluency",
    description: "A hands-on tour of five genuinely useful AI tools you can start using in the next ten minutes, at no cost — what each one is actually best at, the exact steps to get set up, and one concrete example of using it for real work, not a toy demo.",
  },
];

// Returns "" for 0 — the site doesn't label things "Free"; the absence of
// a price and the absence of a 🔒 lock icon together say it plainly enough.
export function formatPrice(paise: number) {
  if (paise === 0) return "";
  return `₹${(paise / 100).toFixed(0)}`;
}
