// Full content for "How Do ChatGPT, Gemini & Claude Actually Work?" —
// step 05 of the homepage's "Learn AI from zero" path (LearnAiPath.tsx).
// Same typed-block pattern as the other articles. No hero image supplied
// for this one — same no-hero pattern as ai-glossary.ts and whatIsAnLlm.ts.
//
// The source draft's closing forward-pointer ("Why Does AI Sometimes Make
// Things Up? ->") isn't repeated as inline text — hallucinations are
// already covered in depth in whatIsGenerativeAi.ts ("Fluent ≠ factual.
// Confident ≠ correct."), so this article's relatedSlugs points there
// instead of implying a separate, not-yet-written piece.

import type { ArticleBlock } from "./aiVsMlVsDl";

export const blocks: ArticleBlock[] = [
  { type: "p", text: "You type a question. A few seconds later, an answer appears. It can feel almost magical. But underneath the chat window, something much more understandable is happening." },
  { type: "p", text: "ChatGPT, Gemini, and Claude are interfaces built around powerful AI models. These models have been trained on enormous amounts of data to learn patterns in language and other types of information. When you send a message, the model processes it, uses the context of your conversation, and generates a response step by step. Let's open the hood — without getting too technical." },

  { type: "h2", text: "1. You type something" },
  { type: "p", text: "Say you ask: \"Why is the sky blue?\" The model doesn't see this exactly the way you do. First, your text is broken down into smaller pieces called tokens — a token might be a whole word, part of a word, punctuation, or another small chunk of text. Roughly: Why | is | the | sky | blue | ? The actual tokenization varies by model. Think of tokens as the building blocks the model works with." },

  { type: "h2", text: "2. The tokens become numbers" },
  { type: "p", text: "Computers don't understand the word \"sky\" the way humans do. The model converts tokens into numerical representations called vectors, which let it work with relationships between concepts. During training, the model can learn that \"sky\" is related to things like blue, clouds, atmosphere, sunlight, Earth — not because someone manually programmed those relationships, but because the model learned statistical patterns from huge amounts of training data." },

  { type: "h2", text: "3. The model looks at the context" },
  { type: "p", text: "Now comes one of the most important ideas behind modern language models: attention. The model doesn't treat every word in your question as equally important — it looks at relationships between different parts of the input to work out what matters for the current prediction." },
  { type: "p", text: "Consider: \"The dog chased the ball because it was excited.\" What does \"it\" refer to? The model needs to weigh the surrounding words and their relationships. The Transformer architecture, introduced in 2017, made this kind of contextual processing extremely powerful and became the foundation for modern large language models. You don't need the math of attention yet — just remember: attention helps the model work out which parts of the context matter to each other." },

  { type: "h2", text: "4. Then comes the surprising part" },
  { type: "p", text: "The model essentially asks: \"Given everything I've seen so far, what should come next?\" Write \"The capital of India is\" and the model might assign high probability to \"Delhi\" — but there are many possible continuations. It calculates probabilities for possible next tokens and selects one according to its generation settings. Then it does the same thing again for the next token." },
  { type: "diagram", text: "The capital of India is\n         ↓\nThe capital of India is Delhi\n         ↓\nThe capital of India is Delhi and\n         ↓\n        ...and another token, and another, until done." },
  { type: "callout", text: "That's the basic engine behind an LLM: predict → generate → predict → generate → repeat." },

  { type: "h2", text: "5. Wait... so it just predicts the next word?" },
  { type: "p", text: "Yes — but don't let that sentence fool you. Modern models have learned extraordinarily complex patterns. During training, the model sees huge quantities of examples and repeatedly learns to predict missing or subsequent tokens; over time its internal parameters are adjusted so its predictions get better. OpenAI describes this as learning relationships in training data and using those patterns to predict and generate content. Google similarly describes Gemini's language models as predicting probable next words based on the prompt and generated text." },
  { type: "p", text: "Importantly, it isn't simply storing a giant database of answers. The model's knowledge is represented primarily through learned parameters and weights, rather than a collection of documents it looks up and copies." },

  { type: "h2", text: "6. Then why does it feel like it's thinking?" },
  { type: "p", text: "Because the process is incredibly sophisticated. Imagine someone who's read an enormous amount of material and become extremely good at recognizing patterns. You ask: \"Explain inflation to a 10-year-old.\" The model doesn't just retrieve a paragraph called \"Inflation for 10-year-olds.\" It uses what it's learned about inflation, economics, language, explanations, children, your instructions, and the conversation so far — and generates a response that fits those constraints. That's why you can say \"Now explain it using cricket\" and get a completely different answer." },

  { type: "h2", text: "7. Why can ChatGPT, Gemini and Claude feel different?" },
  { type: "p", text: "ChatGPT, Gemini, and Claude aren't identical AI systems — they're products built around different models, training processes, interfaces, tools, and system designs. ChatGPT uses OpenAI's models and can combine them with capabilities such as image understanding, coding, and tools. Gemini is Google's multimodal AI family, designed to work across text, images, audio, and other modalities. Claude is Anthropic's AI assistant, with its own models, context handling, and tool capabilities." },
  { type: "p", text: "The underlying implementations differ. But at a high level, language generation follows a similar pattern: your input → tokens → model processes context → predicts output tokens → response." },

  { type: "h2", text: "And there's much more around the model" },
  { type: "p", text: "The model isn't working completely alone. A modern AI assistant can have several components around it:" },
  { type: "diagram", text: "                 YOU\n                  ↓\n             Your prompt\n                  ↓\n             Tokenization\n                  ↓\n          ┌───────────────┐\n          │   AI MODEL    │\n          │               │\n          │  Understands  │\n          │    context    │\n          │       ↓       │\n          │ Predicts      │\n          │ next tokens   │\n          └───────┬───────┘\n                  ↓\n            Generated answer\n                  ↓\n        Tools / Search / Code\n        / Safety / Formatting\n                  ↓\n                 YOU" },
  { type: "p", text: "Depending on the product and task, an AI system may also use web search, files, calculators, code execution, or other external tools rather than relying solely on the model's learned knowledge. That's where AI starts becoming much more powerful than simply \"a chatbot\" — and exactly what RAG and AI Agents (both covered elsewhere on this path) are actually for." },

  { type: "h2", text: "The mental model to remember" },
  { type: "p", text: "You don't need to remember Transformers, embeddings, attention heads, or billions of parameters yet. For now, remember these five steps:" },
  { type: "list", items: [
    "Break it down — your text becomes tokens",
    "Represent it — tokens become numerical representations the model can process",
    "Understand the context — the model uses relationships between tokens to determine what matters",
    "Predict — it estimates what should come next",
    "Repeat — it generates one token after another until the response is complete",
  ] },
  { type: "p", text: "And that happens incredibly quickly." },

  { type: "h2", text: "One last thing..." },
  { type: "p", text: "This also explains one of the most important things to know about AI: a model can produce a very convincing answer without actually knowing that the answer is true. It's generating based on learned patterns and the information available in its context. That's one reason AI can hallucinate — confidently produce something that sounds right but isn't. \"Where it quietly fails\" in the Generative AI piece (see Related reading below) goes deeper on exactly this." },

  { type: "callout", text: "Don't think of ChatGPT as a magical box that \"knows everything.\" Think of it as a very powerful system that processes context and generates the most appropriate response it can — one piece at a time." },
];
