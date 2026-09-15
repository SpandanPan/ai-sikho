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
  {
    id: "rag",
    question: "What problem does RAG (Retrieval-Augmented Generation) actually solve?",
    options: [
      "It makes a model generate images instead of text",
      "It lets a model answer using specific documents it wasn't trained on, instead of guessing from memory",
      "It makes responses generate faster",
      "It replaces the need for a model entirely",
    ],
    correctIdx: 1,
    explanation:
      "RAG retrieves relevant text (your docs, a knowledge base) and hands it to the model as context, so answers can be grounded in specific, current information.",
  },
  {
    id: "context-window",
    question: "What actually happens when a conversation grows past a model's context window?",
    options: [
      "The model gets smarter the longer you talk",
      "The earliest content stops being visible to the model, even though it's still on your screen",
      "The conversation is saved permanently regardless of length",
      "Nothing — context windows don't have a limit",
    ],
    correctIdx: 1,
    explanation:
      "A context window is a hard limit on how much text a model can process per request — older messages effectively \"fall off\" and stop influencing the answer.",
  },
  {
    id: "prompt-injection",
    question: "What is \"prompt injection\" a real security concern for?",
    options: [
      "Only physical robots",
      "Any AI system that reads untrusted input (a webpage, an email) that could contain hidden instructions",
      "It's not a real concern, just a theoretical one",
      "Only fine-tuned models, never prompted ones",
    ],
    correctIdx: 1,
    explanation:
      "If a model reads text from an untrusted source, that text can contain instructions designed to override its original task — a genuine, documented attack class.",
  },
  {
    id: "fine-tuning-vs-prompting",
    question: "What's the actual difference between fine-tuning a model and just prompting it?",
    options: [
      "There is no difference, they're the same thing",
      "Fine-tuning further trains the model's weights on your examples; prompting only shapes behavior at request time, no retraining involved",
      "Prompting is only for images, fine-tuning is only for text",
      "Fine-tuning is always cheaper than prompting",
    ],
    correctIdx: 1,
    explanation:
      "Prompting works within a request; fine-tuning changes the model itself by training it further — more expensive and slower, but can bake in behavior a prompt alone can't reliably get.",
  },
];
