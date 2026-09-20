export type QuizFeedback = {
  persona: string;
  headline: string;
  body: string;
  starters: { title: string; href: string }[];
  nextStepLabel: string;
  nextStepHref: string;
};

// Pulled out of the quiz page so the score-band logic is unit-testable.
// Score bands route to one of the four StartHere.tsx personas — same
// idea as that section, just personalized instead of self-selected.
export function feedbackFor(score: number, total: number): QuizFeedback {
  if (total <= 0) {
    throw new Error("feedbackFor: total must be greater than 0");
  }
  const pct = score / total;

  if (pct >= 0.9) {
    return {
      persona: "Career-Ready",
      headline: "You already think like someone prepping for an AI role.",
      body: "You're past the fundamentals most people are still learning. The Interview Pack is built exactly for where you are.",
      starters: [
        { title: "GenAI Engineer track", href: "/pack/genai-engineer/starter" },
        { title: "Agentic AI track", href: "/pack/agentic-ai/starter" },
        { title: "Data Scientist track", href: "/pack/data-scientist/starter" },
        { title: "Data Engineering track", href: "/pack/data-engineering/starter" },
        { title: "The AI Glossary (for the odd gap)", href: "/articles/ai-glossary" },
      ],
      nextStepLabel: "See the Interview Pack →",
      nextStepHref: "/#career",
    };
  }
  if (pct >= 0.65) {
    return {
      persona: "Builder in the Making",
      headline: "Solid fundamentals — you're ready to go one level deeper.",
      body: "You know what AI is. The next stretch is understanding how it's actually built and connected to real systems.",
      starters: [
        { title: "What Is RAG?", href: "/articles/what-is-rag" },
        { title: "What Are AI Agents?", href: "/articles/what-are-ai-agents" },
        { title: "Tokens and Embeddings", href: "/articles/tokens-and-embeddings" },
        { title: "What Is a Transformer?", href: "/articles/what-is-a-transformer" },
        { title: "Attention, Explained Plainly", href: "/articles/attention-explained" },
      ],
      nextStepLabel: "Browse courses →",
      nextStepHref: "/courses",
    };
  }
  if (pct >= 0.4) {
    return {
      persona: "Everyday AI User",
      headline: "Good instincts, a few myths worth unlearning.",
      body: "You already use AI. These fill in exactly the gaps that trip people up — the difference between a decent prompt and a wasted one, and what these tools can't actually do.",
      starters: [
        { title: "Prompting 101", href: "/articles/prompting-101" },
        { title: "Chatbot or Agent?", href: "/articles/chatbot-or-agent" },
        { title: "What Is RAG?", href: "/articles/what-is-rag" },
        { title: "How AI Is Changing Jobs", href: "/articles/how-ai-is-changing-jobs" },
        { title: "The AI Glossary", href: "/articles/ai-glossary" },
      ],
      nextStepLabel: "Take the AI Fluency course →",
      nextStepHref: "/courses/ai-fluency-basics",
    };
  }
  return {
    persona: "Curious Beginner",
    headline: "Plenty of AI folklore out there — you're exactly who this site is for.",
    body: "No technical background needed. These five explain what AI actually is, in plain language, in the order that makes the least confusing on-ramp.",
    starters: [
      { title: "What Is AI?", href: "/articles/what-is-ai" },
      { title: "AI vs ML vs Deep Learning", href: "/articles/ai-vs-ml-vs-dl" },
      { title: "What Is Generative AI?", href: "/articles/what-is-generative-ai" },
      { title: "What Is an LLM?", href: "/articles/what-is-an-llm" },
      { title: "Prompting 101", href: "/articles/prompting-101" },
    ],
    nextStepLabel: "Go to Start Here →",
    nextStepHref: "/#start-here",
  };
}
