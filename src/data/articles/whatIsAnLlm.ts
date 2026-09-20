// Full content for "What Is an LLM?" — step 04 of the homepage's "Learn
// AI from zero" path (LearnAiPath.tsx). Same typed-block pattern as the
// other articles. No hero image supplied for this one — same pattern as
// ai-glossary.ts, which also has none.

import type { ArticleBlock } from "./aiVsMlVsDl";

export const blocks: ArticleBlock[] = [
  { type: "p", text: "You've probably heard the term LLM everywhere — ChatGPT is powered by an LLM, Claude uses LLMs, Gemini uses LLMs. AI assistants, coding tools, and customer-support bots often have an LLM somewhere in the middle. But what exactly is an LLM, and why does adding the word \"large\" make such a difference?" },
  { type: "callout", text: "An LLM — or Large Language Model — is an AI model trained on enormous amounts of text so it can learn patterns in language and generate useful responses to what you write." },

  { type: "h2", text: "First, what does \"LLM\" actually stand for?" },
  { type: "list", items: [
    "L — Large: trained on very large amounts of data, and contains a very large number of learned parameters",
    "L — Language: designed primarily to work with language — understanding and generating text, though modern models can also work with images, audio, and other information",
    "M — Model: a mathematical system that has learned patterns from data",
  ] },
  { type: "p", text: "Put them together: Large Language Model. Or simply, LLM." },

  { type: "h2", text: "Let's start with \"language\"" },
  { type: "p", text: "Give a human \"The sun rises in the...\" and you'd say \"east\" without thinking hard. \"I put my shoes on my...\" — \"feet.\" \"The capital of India is...\" — \"New Delhi.\" Humans are extremely good at recognizing patterns in language; we've spent our entire lives doing it. LLMs do something related — but mathematically, at enormous scale." },

  { type: "h2", text: "An LLM learns patterns in language" },
  { type: "p", text: "During training, an LLM processes huge quantities of text — sentences, books, articles, websites, documentation, code, conversations. From this it learns relationships between pieces of language: \"The doctor examined the...\" is more likely to be followed by certain words than \"The doctor cooked the...\" It learns relationships between words → sentences → concepts → context. The important part: it isn't given a dictionary of rules. It learns patterns from examples." },

  { type: "h2", text: "But how does it actually learn?" },
  { type: "p", text: "Imagine giving a student thousands of fill-in-the-blank questions. \"The sky is usually ___.\" The student guesses \"green.\" You correct them: \"blue.\" Over millions and eventually billions of examples, the student gets better at predicting. An LLM goes through a loosely analogous process, but instead of a human brain, it uses a huge mathematical model: it makes a prediction, compares it against the training signal, adjusts its internal parameters, and tries again. At enormous scale." },

  { type: "h2", text: "So is an LLM basically autocomplete?" },
  { type: "p", text: "Yes — and no. At a fundamental level, many language models are trained around a task that looks remarkably simple: predict what comes next. \"The cat sat on the...\" → \"mat.\" But to make good predictions consistently, the model needs to learn grammar, vocabulary, context, facts, writing styles, relationships between concepts, programming syntax, and multiple languages. \"It's just predicting the next token\" is technically accurate but doesn't capture how much structure the model has to learn to do that well." },

  { type: "h2", text: "Wait — what is a token?" },
  { type: "p", text: "A token is a chunk of text a model processes — not always a complete word. \"Generative AI is fascinating.\" might break into several tokens; a long word can split into multiple pieces, and punctuation counts as tokens too. So when people say \"this model has a 100,000-token context window,\" they don't mean 100,000 words — they mean roughly 100,000 pieces of text the model can process at once." },
  { type: "p", text: "Why not just use whole words? Because language is messy — \"play,\" \"playing,\" \"played,\" \"player\" share meaningful pieces. Breaking text into smaller chunks lets models handle unfamiliar words, different word forms, names, technical terms, code, and multiple languages, while keeping the model's vocabulary manageable. Tokens are one of the bridges between human language and mathematical computation." },

  { type: "h2", text: "But computers don't understand words like we do" },
  { type: "p", text: "A computer doesn't naturally understand \"dog\" the way you do. For a model to do math on language, text has to become numbers. A simplified view of the pipeline:" },
  { type: "diagram", text: "Human language\n      ↓\n    Tokens\n      ↓\n Numerical representations\n      ↓\n   Neural network\n      ↓\n   Predictions\n      ↓\nGenerated language" },

  { type: "h2", text: "Where do \"embeddings\" come in?" },
  { type: "p", text: "An embedding is a numerical representation of something — a word, token, sentence, or other piece of information — in a mathematical space, built to capture relationships a machine-learning system can work with. \"Doctor,\" \"hospital,\" and \"patient\" have different meanings but are related; so do \"Paris,\" \"France,\" and \"Europe\" — and those relationships can be represented mathematically. You don't need the math yet — just remember: embeddings turn meaning and relationships into numbers machines can work with." },

  { type: "h2", text: "So where does the \"large\" come from?" },
  { type: "p", text: "An LLM isn't just trained on a large amount of information — modern LLMs can also contain billions or more learned parameters: numerical values inside the model adjusted during training, loosely the model's enormous collection of learned settings. More parameters don't automatically mean a better model, but larger models can have more capacity to learn complex patterns, especially combined with good training data, architectures, and techniques. That's where \"Large\" in Large Language Model comes from." },

  { type: "h2", text: "A useful analogy: learning a language" },
  { type: "p", text: "Imagine three students. Student A has read a few books. Student B has read thousands. Student C has spent years reading books, technical papers, newspapers, conversations, manuals, and code. You'd expect very different levels of exposure. An LLM is loosely analogous to the third student — with one crucial difference: it doesn't learn the human way. It learns statistical and mathematical representations through training. Still, the analogy helps explain why exposure to enormous, varied data can produce surprisingly capable language systems." },

  { type: "h2", text: "Does an LLM store everything it has read?" },
  { type: "p", text: "It's tempting to imagine an LLM as a gigantic hard drive containing every sentence it trained on. That's not a good mental model. During training, the model's parameters are adjusted based on the data it processes, resulting in learned mathematical patterns — not a perfect record it can retrieve on demand. It doesn't mean everything it generates traces back to a specific memorized sentence." },
  { type: "callout", text: "There are real exceptions around memorization and reproduction of training data, but the basic idea holds: an LLM is not a searchable database of everything it was trained on." },

  { type: "h2", text: "Then how does ChatGPT answer a question?" },
  { type: "p", text: "Ask \"Why is the sky blue?\" and a simplified version of what happens:" },
  { type: "diagram", text: "1. Your message becomes tokens\n2. The model processes the context\n3. It predicts what should come next\n4. It generates more tokens, one piece at a time\n5. You see the completed response" },
  { type: "p", text: "It can feel like the AI wrote the whole answer in one shot, but generation generally happens sequentially — which is why it can produce paragraph after paragraph." },

  { type: "h2", text: "Here's the surprising part" },
  { type: "p", text: "The basic mechanism is simple to describe: predict the next token. Yet the behavior that emerges is remarkably sophisticated. Give a capable model \"Explain photosynthesis to a five-year-old,\" then \"Now explain it to a biology student,\" then \"Give me five questions to test my understanding,\" then \"Turn those into multiple-choice questions\" — and it adapts every time. It isn't running a separate hard-coded program for each task. It has learned broad patterns that let it do many kinds of language work." },

  { type: "h2", text: "This is why LLMs feel different from traditional software" },
  { type: "p", text: "Traditional software works through explicit instructions someone wrote: \"IF customer_age > 60 THEN apply discount.\" An LLM works differently — you don't specify every rule. You give an instruction like \"Write a polite email declining this meeting,\" and the model uses patterns learned during training to generate an appropriate response." },
  { type: "callout", text: "This is one of the biggest shifts modern AI introduces: we can increasingly tell computers what we want in natural language instead of specifying every step." },

  { type: "h2", text: "But an LLM isn't a database" },
  { type: "p", text: "Ask \"What was my company's revenue last quarter?\" — if that information was never provided to the model or connected through a proper data source, it may not actually have access to it. It might still generate an answer that sounds plausible. That's the dangerous part." },
  { type: "p", text: "An LLM is fundamentally a generative model. It isn't automatically connected to your company's database, the latest news, your Google Drive, your email, your bank account, the internet, or your private documents. Some AI applications connect models to these sources using additional tools — that's a different part of the system, and it's exactly what RAG is for." },
];
