// Full content for "The AI Glossary: 20 Terms You'll Actually Hear". Same
// typed-block pattern as the other articles — each term is just an h2 +
// p pair, reusing the existing renderer rather than inventing a new block
// type for what's really just a very short-form article.

import type { ArticleBlock } from "./aiVsMlVsDl";

const TERM_LIST = [
  { term: "Prompt", def: "What you type into an AI tool — a question, an instruction, a document to work from. How you phrase it matters more than most people expect; see Prompting 101 for the habits that make a real difference." },
  { term: "Token", def: "A small chunk of text a model reads and writes, roughly a word-piece rather than a whole word. \"Unbelievable\" might be three tokens: \"Un,\" \"believ,\" \"able.\" Providers count usage and cost in tokens, not words." },
  { term: "LLM (Large Language Model)", def: "A deep-learning model trained on huge amounts of text to predict the next token, over and over. ChatGPT, Claude, and Gemini are all products built around an LLM — not the models' actual names, just the category." },
  { term: "Context window", def: "How much text a model can \"see\" at once — your conversation, any documents you've pasted in, its own earlier replies. Once a conversation gets longer than the window, the oldest parts start dropping out of view." },
  { term: "Hallucination", def: "A confident, wrong answer — an invented citation, a made-up statistic, a fact that sounds real but isn't. Not a lie; the model is predicting a plausible continuation, not checking a database. Always verify anything specific and checkable." },
  { term: "Embedding", def: "A way of turning a word, sentence, or document into a list of numbers so a computer can compare meaning mathematically. Two pieces of text with similar meaning end up with similar numbers, even if they don't share a single word." },
  { term: "Vector database", def: "A database built to store embeddings and quickly find the ones most similar to a new query. It's the piece that makes \"search by meaning, not just keyword\" possible at scale." },
  { term: "RAG (Retrieval-Augmented Generation)", def: "A setup where an AI looks up relevant documents (using a vector database, usually) before answering, instead of relying only on what it memorized during training. It's how a chatbot can answer questions about your company's own internal documents." },
  { term: "Fine-tuning", def: "Taking an already-trained model and training it further on a smaller, specific dataset so it gets better at one particular job — a certain tone, a certain domain, a certain task — without starting from scratch." },
  { term: "Inference", def: "The act of actually running a trained model to get an answer — as opposed to training, which is the (much more expensive) process of building the model in the first place. Every time you send a message to a chatbot, that's inference." },
  { term: "Agent", def: "An AI system that can plan a sequence of steps and use tools (search, calculators, APIs, code) to actually do something, not just reply. See \"Chatbot or Agent?\" for the full distinction — most everyday AI you use is a chatbot, not an agent." },
  { term: "System prompt", def: "Instructions given to an AI before the conversation even starts, usually invisible to the user — \"You are a helpful support agent for Acme Corp, answer only from the provided docs.\" It shapes behaviour for the whole session." },
  { term: "Temperature", def: "A setting that controls how \"safe\" or \"random\" a model's word choices are. Low temperature gives more predictable, repetitive answers; high temperature gives more varied, sometimes stranger ones. Most chat products pick a sensible default for you." },
  { term: "Few-shot prompting", def: "Showing the model a couple of examples of what you want before asking for the real thing — \"here's an example of the tone I want, now write mine in the same style.\" Examples are often more effective than long descriptions." },
  { term: "Chain-of-thought", def: "Asking (or letting) a model work through a problem step by step before giving a final answer, rather than jumping straight to a conclusion. Tends to improve accuracy on anything involving multi-step reasoning or arithmetic." },
  { term: "Multimodal", def: "A model that can handle more than just text — images, audio, sometimes video, in addition to language. Ask it to describe a photo or summarize an audio clip, and multimodal is what makes that possible." },
  { term: "Transformer", def: "The architecture behind essentially every modern AI model, introduced in a 2017 paper. Its key idea — attention — lets a model weigh every word against every other word at once, instead of reading strictly left to right." },
  { term: "Attention", def: "The mechanism inside a Transformer that decides which other words matter most when interpreting a given word. In \"the bank raised interest rates,\" attention is what lets the model realize \"bank\" means a financial institution, not a riverbank." },
  { term: "Model weights", def: "The actual numbers learned during training — millions or billions of them — that determine how a model responds. \"Open-weight\" models publish these numbers for anyone to download and run; closed models keep them private on the provider's servers." },
  { term: "API", def: "The way a piece of software (like an app you're building) talks to an AI model programmatically, instead of a human typing into a chat window. Almost every AI-powered product is a regular app with an API call to a model tucked inside it." },
];

export const blocks: ArticleBlock[] = [
  { type: "p", text: "Every field has its own shorthand, and AI has accumulated a lot of it fast. None of these words are complicated once someone actually explains them — they just tend to get thrown around as if everyone already knows them." },
  { type: "p", text: "This is that explanation, once, in one place. Twenty terms you'll genuinely keep running into, each in a sentence or two, no prerequisites." },
  ...TERM_LIST.flatMap((t): ArticleBlock[] => [
    { type: "h2", text: t.term },
    { type: "p", text: t.def },
  ]),
  { type: "callout", text: "You don't need to memorize this page. Bookmark it — come back whenever a term stops you mid-sentence somewhere else on the site." },
];
