// Free content — the top-of-funnel explainer pillar, organized as a ladder
// that mirrors the pricing ladder's vocabulary (Starter → Builder →
// Architect internally, shown as "Under the Hood"), so a reader's reading
// level and buying stage tell the same story. "architect" pieces should be
// revisited whenever a paper in that space meaningfully moves the needle
// (same logic as the model cost tracker).

export type Level = "starter" | "builder" | "architect";

export type Article = {
  slug: string;
  title: string;
  summary: string;
  level: Level;
  status: "coming-soon" | "published";
  // Only meaningful once published — a coming-soon piece doesn't have a
  // real word count yet, so these are omitted rather than guessed.
  readMinutes?: number;
  topic?: string;
  // 2-3 slugs to surface as "Related reading" at the bottom of this
  // article's page. Only worth setting once both ends of the link exist.
  relatedSlugs?: string[];
  // True for genuinely evergreen pieces that stay accurate for a long
  // time (a concept explainer, not something tied to this month's news or
  // a specific model's current pricing). Shown in a separate Archive
  // section on /articles instead of alongside newer/current-affairs
  // pieces at the same level, so a reader browsing "what's new" doesn't
  // wade through old-but-still-true content to find it, and a reader who
  // wants the durable foundations knows exactly where to look.
  archived?: boolean;
};

export const levelInfo: Record<Level, { label: string; verb: string; tagline: string }> = {
  starter: { label: "Starter", verb: "Understand", tagline: "Understand AI without the jargon." },
  builder: { label: "Builder", verb: "Use & Build", tagline: "Understand what's underneath the AI you're using." },
  architect: { label: "Under the Hood", verb: "Explore deeper", tagline: "For readers who want to understand the technology itself." },
};

// The one recommendation the homepage and this page both point at for a
// total newcomer — see StartHere.tsx's first card and LearnAiPath.tsx's
// step 02. Kept as a single source of truth instead of hardcoded twice.
export const startHereSlug = "what-is-ai";

export const articles: Article[] = [
  // -- Starter: true beginners, no prior AI vocabulary assumed --
  // Published pieces first — this is a library, not a catalogue of
  // promises, so what actually exists leads.
  {
    slug: "what-is-ai",
    title: "What Is AI?",
    summary: "The one-paragraph answer, before any of the jargon that usually comes with it.",
    level: "starter",
    status: "published",
    readMinutes: 3,
    topic: "AI Fundamentals",
    relatedSlugs: ["ai-vs-ml-vs-dl"],
  },
  {
    slug: "ai-vs-ml-vs-dl",
    title: "AI vs. Machine Learning vs. Deep Learning",
    summary: "The three terms people use interchangeably, and why they actually nest inside each other.",
    level: "starter",
    status: "published",
    readMinutes: 6,
    topic: "AI Fundamentals",
    relatedSlugs: ["what-is-ai", "what-is-generative-ai", "ai-glossary"],
  },
  {
    slug: "what-is-generative-ai",
    title: "What Is Generative AI?",
    summary: "The AI that doesn't just recognize things — it creates them.",
    level: "starter",
    status: "published",
    readMinutes: 9,
    topic: "Generative AI",
    relatedSlugs: ["ai-vs-ml-vs-dl", "what-is-an-llm", "prompting-101"],
  },
  {
    slug: "what-is-an-llm",
    title: "What Is an LLM?",
    summary: "The technology behind ChatGPT, Claude, Gemini — and much of today's Generative AI.",
    level: "starter",
    status: "published",
    readMinutes: 8,
    topic: "LLMs",
    relatedSlugs: ["what-is-generative-ai", "ai-vs-ml-vs-dl", "prompting-101"],
  },
  {
    slug: "chatbot-or-agent",
    title: "Chatbot or Agent? The Difference That Actually Matters",
    summary: "One replies. The other takes multi-step actions on its own. Here's how to tell which you're using.",
    level: "starter",
    status: "published",
    readMinutes: 7,
    topic: "Agents",
    relatedSlugs: ["prompting-101", "what-are-ai-agents"],
  },
  {
    slug: "prompting-101",
    title: "Prompting 101: How to Actually Get Good Answers",
    summary: "The handful of habits that separate a useless reply from a genuinely useful one.",
    level: "starter",
    status: "published",
    readMinutes: 8,
    topic: "Using AI",
    relatedSlugs: ["chatbot-or-agent", "ai-glossary"],
  },
  {
    slug: "ai-glossary",
    title: "The AI Glossary: 20 Terms You'll Actually Hear",
    summary: "Token, hallucination, fine-tuning, context window — translated once, in one place.",
    level: "starter",
    status: "published",
    readMinutes: 5,
    topic: "Reference",
    relatedSlugs: ["ai-vs-ml-vs-dl", "prompting-101"],
  },

  // The next 7 are stubs for the homepage's "Learn AI from zero" numbered
  // path (see LearnAiPath.tsx) — steps 01, 03, 04, 05, 08, 09, 10.
  { slug: "how-chatgpt-works", title: "How Does ChatGPT Actually Work?", summary: "What happens between you hitting enter and the words appearing on screen.", level: "starter", status: "coming-soon", topic: "LLMs" },
  { slug: "what-is-rag", title: "What Is RAG?", summary: "How an AI answers questions about documents it was never trained on.", level: "starter", status: "coming-soon", topic: "RAG" },
  { slug: "what-are-ai-agents", title: "What Are AI Agents?", summary: "The building blocks behind a system that can plan, use tools, and take action.", level: "starter", status: "coming-soon", topic: "Agents" },
  { slug: "how-ai-is-changing-jobs", title: "How AI Is Changing Jobs", summary: "What's actually shifting in day-to-day work, beyond the headlines.", level: "starter", status: "coming-soon", topic: "Careers" },
  { slug: "ai-in-your-day", title: "Where AI Already Touches Your Day", summary: "The quiet, unglamorous places AI is already running — before you ever open a chatbot.", level: "starter", status: "coming-soon", topic: "AI Fundamentals" },
  { slug: "what-models-actually-cost", title: "What Models Actually Cost", summary: "Per-token pricing across Claude, GPT, and Gemini, translated into what a real feature costs to run — updated as pricing changes.", level: "starter", status: "coming-soon", topic: "Costs & Pricing" },

  // -- Builder: some technical comfort, actively building something --
  { slug: "what-is-a-transformer", title: "What Is a Transformer?", summary: "The architecture behind every model discussed on this site — explained without the math.", level: "builder", status: "coming-soon", topic: "LLMs" },
  { slug: "attention-explained", title: "Attention, Explained Plainly", summary: "Why a model \"attends\" to some words more than others when it generates the next one.", level: "builder", status: "coming-soon", topic: "LLMs" },
  { slug: "tokens-and-embeddings", title: "Tokens and Embeddings: How Words Become Numbers", summary: "What a token actually is, and how meaning gets turned into something a model can compute on.", level: "builder", status: "coming-soon", topic: "LLMs" },
  { slug: "pretraining-vs-finetuning-vs-rlhf", title: "Pretraining vs. Fine-Tuning vs. RLHF", summary: "Why a base model refuses less, and where each of these three stages actually happens.", level: "builder", status: "coming-soon", topic: "Training" },
  { slug: "context-window-explained", title: "The Context Window, Explained", summary: "What a model can \"see\" at once — and why a bigger window isn't automatically a smarter model.", level: "builder", status: "coming-soon", topic: "LLMs" },

  // -- Architect ("Under the Hood"): advanced, research-grounded, revisit as papers land --
  { slug: "reasoning-models-test-time-compute", title: "Reasoning Models and Test-Time Compute", summary: "Why models now \"think before answering\" — the shift Gemini 2.5-style releases popularized.", level: "architect", status: "coming-soon", topic: "Research" },
  { slug: "mixture-of-experts-plainly", title: "Mixture-of-Experts, Plainly", summary: "How a trillion-parameter model can run cheaply by only waking up a fraction of itself per query.", level: "architect", status: "coming-soon", topic: "Architecture" },
  { slug: "hybrid-mamba-transformer", title: "Hybrid Mamba-Transformer Architectures", summary: "Why some 2026 models blend state-space layers with attention instead of picking one.", level: "architect", status: "coming-soon", topic: "Architecture" },
  { slug: "agentic-evaluation-beyond-benchmarks", title: "Agentic Evaluation: Beyond Benchmarks", summary: "Why judging an agent now means giving it a real, verifiable task instead of a quiz question.", level: "architect", status: "coming-soon", topic: "Evaluation" },
  { slug: "long-context-and-multimodal-reasoning", title: "Long-Context and Multimodal Reasoning", summary: "What a longer context window actually unlocks, and how models fuse text, image, and audio.", level: "architect", status: "coming-soon", topic: "Research" },
];
