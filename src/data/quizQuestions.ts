// v0 ships this hardcoded so the quiz works with zero DB setup.
// Once Postgres is wired up, seed these into QuizQuestion and read from
// /api/quiz instead — same shape, no page changes needed.

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: "code",
    question: "Can current AI models write working code from a plain-English description?",
    options: [
      "Never",
      "Only very simple snippets",
      "Yes, including fairly complex programs — though it can still make mistakes",
      "Only if you already know how to code",
    ],
    correctIdx: 2,
    explanation:
      "Modern models generate substantial, working code from a description — but they still make mistakes, so review matters more than blind trust.",
  },
  {
    id: "hallucination",
    question: "If you ask an AI chatbot something it doesn't actually know, what usually happens?",
    options: [
      "It always says \"I don't know\"",
      "It may confidently give a wrong answer",
      "It refuses to respond",
      "It asks a human for help",
    ],
    correctIdx: 1,
    explanation:
      "This is called hallucination — a confident-sounding but incorrect answer. Always verify anything that actually matters.",
  },
  {
    id: "deepfakes",
    question: "Can AI generate realistic images, video, and voice that are hard to tell from real ones?",
    options: [
      "No, it's always obviously fake",
      "Yes — and this is now a real, documented concern",
      "Only images, not video or voice",
      "Only cartoons and illustrations",
    ],
    correctIdx: 1,
    explanation:
      "Synthetic media has gotten good enough that verification (not eyeballing) is the only reliable defense.",
  },
  {
    id: "agents",
    question: "What does an \"AI agent\" do differently from a regular chatbot?",
    options: [
      "Nothing — it's just marketing",
      "It can take multi-step actions on its own, like browsing or calling other tools",
      "It's always a physical robot",
      "It can only answer one question at a time",
    ],
    correctIdx: 1,
    explanation:
      "An agent plans and executes a sequence of actions using tools, rather than just replying to one prompt.",
  },
  {
    id: "cost",
    question: "Do you need to pay to use any AI model at all?",
    options: [
      "Yes, all useful AI costs money",
      "No — several capable models are free via free tiers or running them yourself",
      "Only businesses can access AI",
      "AI is always subscription-only",
    ],
    correctIdx: 1,
    explanation:
      "Tools like Ollama (fully local) and free tiers from Google AI Studio or Groq mean you can build real things at zero cost.",
  },
  {
    id: "memory",
    question: "Do AI models \"remember\" you permanently across separate conversations, like a person would?",
    options: [
      "Yes, always",
      "Generally no — most don't retain memory between separate chats unless a product adds that feature",
      "Only if you pay",
      "They even forget within the same conversation",
    ],
    correctIdx: 1,
    explanation:
      "That's the difference between a context window (what it can see right now) and persistent memory (a separate feature some products bolt on).",
  },
];
