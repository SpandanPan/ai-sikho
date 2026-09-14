// Free content — the top-of-funnel explainer pillar, organized as a ladder
// that mirrors the pricing ladder's vocabulary (Starter → Builder →
// Architect), so a reader's reading level and buying stage tell the same
// story. "architect" pieces should be revisited whenever a paper in that
// space meaningfully moves the needle (same logic as the model cost tracker).

export type Level = "starter" | "builder" | "architect";

export type Article = {
  slug: string;
  title: string;
  summary: string;
  level: Level;
  status: "coming-soon" | "published";
};

export const levelInfo: Record<Level, { label: string; tagline: string }> = {
  starter: { label: "Starter", tagline: "Zero jargon assumed. For \"what even is this\" readers." },
  builder: { label: "Builder", tagline: "For people actively building something — RAG, agents, courses." },
  architect: { label: "Architect", tagline: "Advanced and research-grounded. Revisited as papers move the needle." },
};

export const articles: Article[] = [
  // -- Starter: true beginners, no prior AI vocabulary assumed --
  {
    slug: "ai-vs-ml-vs-dl",
    title: "AI vs. Machine Learning vs. Deep Learning",
    summary: "The three terms people use interchangeably, and why they actually nest inside each other.",
    level: "starter",
    status: "coming-soon",
  },
  {
    slug: "chatbot-or-agent",
    title: "Chatbot or Agent? The Difference That Actually Matters",
    summary: "One replies. The other takes multi-step actions on its own. Here's how to tell which you're using.",
    level: "starter",
    status: "coming-soon",
  },
  {
    slug: "prompting-101",
    title: "Prompting 101: How to Actually Get Good Answers",
    summary: "The handful of habits that separate a useless reply from a genuinely useful one.",
    level: "starter",
    status: "coming-soon",
  },
  {
    slug: "ai-glossary",
    title: "The AI Glossary: 20 Terms You'll Actually Hear",
    summary: "Token, hallucination, fine-tuning, context window — translated once, in one place.",
    level: "starter",
    status: "coming-soon",
  },
  {
    slug: "ai-in-your-day",
    title: "Where AI Already Touches Your Day",
    summary: "The quiet, unglamorous places AI is already running — before you ever open a chatbot.",
    level: "starter",
    status: "coming-soon",
  },
  {
    slug: "what-models-actually-cost",
    title: "What Models Actually Cost",
    summary: "Per-token pricing across Claude, GPT, and Gemini, translated into what a real feature costs to run — updated as pricing changes.",
    level: "starter",
    status: "coming-soon",
  },

  // -- Builder: some technical comfort, actively building something --
  {
    slug: "what-is-a-transformer",
    title: "What Is a Transformer?",
    summary: "The architecture behind every model discussed on this site — explained without the math.",
    level: "builder",
    status: "coming-soon",
  },
  {
    slug: "attention-explained",
    title: "Attention, Explained Plainly",
    summary: "Why a model \"attends\" to some words more than others when it generates the next one.",
    level: "builder",
    status: "coming-soon",
  },
  {
    slug: "tokens-and-embeddings",
    title: "Tokens and Embeddings: How Words Become Numbers",
    summary: "What a token actually is, and how meaning gets turned into something a model can compute on.",
    level: "builder",
    status: "coming-soon",
  },
  {
    slug: "pretraining-vs-finetuning-vs-rlhf",
    title: "Pretraining vs. Fine-Tuning vs. RLHF",
    summary: "Why a base model refuses less, and where each of these three stages actually happens.",
    level: "builder",
    status: "coming-soon",
  },
  {
    slug: "context-window-explained",
    title: "The Context Window, Explained",
    summary: "What a model can \"see\" at once — and why a bigger window isn't automatically a smarter model.",
    level: "builder",
    status: "coming-soon",
  },

  // -- Architect: advanced, research-grounded, revisit as papers land --
  {
    slug: "reasoning-models-test-time-compute",
    title: "Reasoning Models and Test-Time Compute",
    summary: "Why models now \"think before answering\" — the shift Gemini 2.5-style releases popularized.",
    level: "architect",
    status: "coming-soon",
  },
  {
    slug: "mixture-of-experts-plainly",
    title: "Mixture-of-Experts, Plainly",
    summary: "How a trillion-parameter model can run cheaply by only waking up a fraction of itself per query.",
    level: "architect",
    status: "coming-soon",
  },
  {
    slug: "hybrid-mamba-transformer",
    title: "Hybrid Mamba-Transformer Architectures",
    summary: "Why some 2026 models blend state-space layers with attention instead of picking one.",
    level: "architect",
    status: "coming-soon",
  },
  {
    slug: "agentic-evaluation-beyond-benchmarks",
    title: "Agentic Evaluation: Beyond Benchmarks",
    summary: "Why judging an agent now means giving it a real, verifiable task instead of a quiz question.",
    level: "architect",
    status: "coming-soon",
  },
  {
    slug: "long-context-and-multimodal-reasoning",
    title: "Long-Context and Multimodal Reasoning",
    summary: "What a longer context window actually unlocks, and how models fuse text, image, and audio.",
    level: "architect",
    status: "coming-soon",
  },
];
