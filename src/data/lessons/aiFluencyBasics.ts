// Real lesson content for "AI Fluency: What It Actually Is" — condensed,
// de-duplicated, with interactive dialogue and SVG diagrams to replace
// text-heavy explanations. Assumes zero AI background.

import type { LessonAnimationKind } from "@/components/LessonAnimation";

export type LessonSection = {
  heading: string;
  kind?: LessonAnimationKind;
  component?: "timeline" | "dialogue" | "ai-nesting" | "attention" | "data-growth" | "token" | "hallucination" | "transformer" | "cheatsheet";
  body: string[];
  /** Extra detail tucked behind a "Go deeper" toggle instead of always-visible body copy. */
  deeper?: string[];
  url?: string;
  myth?: string;
  fact?: string;
  tryIt?: string;
};

export type Lesson = {
  slug: string;
  estMinutes: number;
  sections: LessonSection[];
};

export const lessons: Record<string, Lesson> = {
  "ai-fluency-basics": {
    slug: "ai-fluency-basics",
    estMinutes: 30,
    sections: [
      {
        heading: "Watch two people talk about AI",
        component: "dialogue",
        body: [
          "AI can feel like it arrived overnight, announced it could write your emails, and immediately made everyone wonder whether their job was now a button. Take a breath. Most of the mystery disappears once you know what the tool is actually doing — and what it is definitely not doing.",
          "In this conversation, Learner asks the normal questions: \"Is this just Google with confidence?\" \"Does it know things?\" \"Why does it sometimes sound brilliant and sometimes confidently invent a book that does not exist?\" Guide answers without the jargon parade.",
          "By the end of this lesson, you will have a useful mental model: AI is extremely good at producing and reshaping language, images, and patterns; it is not automatically a source of truth, judgment, or accountability. That distinction helps you get useful results without falling for the magic-show version of AI.",
        ],
      },
      {
        heading: "The three layers of AI",
        component: "ai-nesting",
        body: [
          "People use \"AI\" to mean almost anything with a screen and a vaguely futuristic glow. In reality it is four nested ideas, each one narrower than the last. Tap a ring above to see what actually lives there.",
          "The short version: AI is the whole field. Machine learning is the most common way it gets built. Deep learning is one powerful kind of machine learning. And an LLM — what ChatGPT and Claude actually are — is deep learning trained specifically on text.",
        ],
        deeper: [
          "Artificial Intelligence is the big umbrella: computer systems performing tasks we associate with human intelligence — recognizing speech, recommending a movie, spotting fraud, translating text, playing chess. Your map app estimating traffic is AI. So is your email's spam filter.",
          "Machine Learning is the most common way modern AI is built. Instead of writing every rule by hand — \"if an email contains this phrase, call it spam\" — you give a system many examples of spam and non-spam, and it learns the statistical patterns itself.",
          "Deep Learning is a powerful type of machine learning built from many connected layers, often called neural networks. It is especially good at messy, enormous kinds of information: language, audio, images, video, code.",
          "LLMs are deep-learning systems trained on huge amounts of text and code. They can perform many language tasks in one place — drafting, summarizing, translating, explaining — but that flexibility does not mean they understand the world the way a person does.",
        ],
        myth: "AI, machine learning, deep learning, and ChatGPT are different names for the same thing.",
        fact: "They are nested. AI is the broad field. Machine learning is a common approach. Deep learning is one kind of machine learning. ChatGPT is one product built with a type of deep-learning model called an LLM.",
        tryIt: "Look around your phone for two examples. A spam filter or movie recommendation is usually narrow AI: it does one job. A chatbot can attempt many language tasks. The second is more flexible, not magically more trustworthy.",
      },
      {
        heading: "Why did this happen now?",
        component: "data-growth",
        body: [
          "The sudden popularity of AI was not caused by one dramatic \"we finally built a brain\" moment. Several ingredients matured at the same time: enormous amounts of digital data, better methods for training models, powerful computing hardware, and enough investment to run very large experiments.",
          "For decades, computers had limited examples from which to learn. Then the world started producing digital text, photos, video, software code, subtitles, scientific papers, product listings, conversations, and documentation at a ridiculous pace. The internet became a giant, messy library — with useful books, cat photos, bad recipes, and an alarming number of opinions about whether a hot dog is a sandwich.",
          "Modern language models are trained on very large collections of text and code. They do not contain a perfect copy of the internet, and companies use different mixtures of licensed, public, and created data. But the scale is far beyond what a person could read in several lifetimes.",
          "At the same time, specialized chips made it possible to train models on many examples simultaneously. The result was a sharp improvement in how well machines could recognize patterns in language and images — enough for ordinary people to notice.",
          "So AI did not appear from nowhere in 2022. It was a long research story that became visible when the tools finally became useful, cheap enough to offer, and simple enough to type into.",
        ],
      },
      {
        heading: "The paper that changed everything",
        component: "attention",
        body: [
          "Toggle the sentence above. Same word, \"bank\" — completely different meaning, depending only on which nearby words it pays attention to. That trick, called attention, is the core idea behind a 2017 paper called \"Attention Is All You Need.\"",
          "Older systems read one word at a time, like reading through a drinking straw. Attention lets a model weigh every word against every other word at once, which is both faster to train and far better at tracking meaning across a long sentence.",
        ],
        deeper: [
          "That architecture is called a Transformer. GPT means Generative Pre-trained Transformer: a model trained in advance to generate likely text. Many modern systems build on Transformer ideas, even when the products and model names differ.",
          "The breakthrough was not that AI suddenly began \"thinking\" like a human. It gained a far better way to model relationships in data at enormous scale. Less cinematic than a robot awakening, but much more useful.",
        ],
        myth: "AI improved only because computers became faster.",
        fact: "Faster hardware mattered, but the Transformer architecture was a major unlock because it let models learn from huge datasets more efficiently.",
      },
      {
        heading: "The breakthrough visualization",
        component: "transformer",
        body: [
          "Side by side: the old way read language as a line, one word after another, losing track of the beginning by the end of a long sentence — a relatable experience for anyone reading a legal contract. The new way looks at the whole sentence every time.",
          "That single change is most of why a modern model can follow a detailed instruction, summarize a long passage, or keep track of a topic across several paragraphs.",
        ],
        deeper: [
          "Attention is not human concentration. The model is not staring thoughtfully out of a rainy window. It is a mathematical way to score which pieces of information are most useful for predicting the next piece of text.",
        ],
      },
      {
        heading: "How we got here",
        component: "timeline",
        body: [
          "AI has been a field since the 1950s. For much of its history, progress came in waves: excitement, ambitious promises, disappointment, and then a period when funding dried up. These quieter stretches are often called \"AI winters.\"",
          "The recent wave stands out because several decades of research finally met the scale of the internet and modern computing. Image recognition improved, speech-to-text became normal, recommendation systems became unavoidable, and large language models became capable enough to hold useful conversations.",
          "ChatGPT's public release in 2022 was not the beginning of AI. It was the moment millions of people could interact with a powerful language model in a simple chat box. Suddenly, a technology that had mostly lived in labs, apps, and back-office systems had a front door.",
          "The lesson from this timeline is useful: ignore both extremes. AI is neither a brand-new fad with no history nor an all-powerful intelligence that appeared overnight. It is a rapidly improving technology with real strengths, real limits, and a very long backstory.",
        ],
      },
      {
        heading: "What you're actually talking to",
        kind: "predict",
        body: [
          "When you chat with a tool such as ChatGPT, you are usually interacting with a large language model. At its core, its job is surprisingly simple: predict what token is likely to come next, then do that again and again.",
          "A token is a small chunk of text — sometimes a word, sometimes part of a word, punctuation, or a space. Given \"The capital of France is…,\" the model gives \"Paris\" a very high probability because it has learned that pattern from many examples.",
          "That sounds almost too simple, but repeated next-token prediction can create surprisingly capable behavior. To predict the next part of a good explanation, the model needs to learn grammar, style, common facts, relationships between ideas, and patterns in code. It becomes excellent at continuing, transforming, and organizing text.",
          "It is not usually searching a live database each time it answers. Some AI products can browse the web, search connected files, call a calculator, or access other tools — but those are extra capabilities. A response should clearly indicate when current information or an external source was used.",
          "A useful mental model: an LLM is an incredibly well-read improviser, not an all-seeing oracle. It can produce a brilliant first draft. It can also confidently complete a pattern that happens to be wrong.",
        ],
        myth: "A chatbot automatically looks up the answer somewhere and reports it back.",
        fact: "A language model normally generates a response from learned patterns and the information in your conversation. It may use live sources only when the product gives it a search or data tool and actually uses that tool.",
      },
      {
        heading: "What it's genuinely good at",
        kind: "draft",
        body: [
          "AI is at its best when the task is about turning information into a different shape. Think drafting, outlining, rewriting, summarizing, categorizing, translating, brainstorming, and explaining.",
          "It is excellent at getting you past the blank page. Give it rough notes such as \"Q3 sales up, thank team, report Friday,\" and ask for a friendly update. It can provide a usable draft in seconds. You still own the message, but you no longer have to begin by negotiating with a blinking cursor.",
          "It can adapt explanations to an audience. Ask for compound interest \"for a 10-year-old,\" then \"for a new finance analyst.\" The underlying concept stays similar, while the vocabulary, examples, and detail change.",
          "It can organize material you provide. Paste messy meeting notes and ask for decisions, owners, deadlines, and open questions. This is often safer than asking it to invent information, because the source material is already in the conversation.",
          "It can help you think, too. Ask for five ways to structure a presentation, objections a customer might raise, or questions you have not considered. Treat the output as a starting point for your judgment, not a replacement for it.",
        ],
        tryIt: "Paste three rough bullet points about your week and ask for a warm, five-sentence update for your team. Then edit it until it sounds like you. The goal is not to make the AI sound human; it is to save your human effort for the parts that matter.",
      },
      {
        heading: "Where it quietly fails",
        component: "hallucination",
        body: [
          "Hit \"Check the sources\" above. Before you did, both answers looked equally sure — same tone, same confidence. That is the actual danger: fluency is not evidence. A model can state a wrong answer exactly as confidently as a right one.",
          "This is called a hallucination — not a lie, just a plausible-sounding guess with nothing behind it. It shows up most with citations, statistics, dates, and arithmetic. The fix isn't distrust everything; it's verify the specific, checkable claims.",
        ],
        deeper: [
          "A model may invent a citation, a statistic, a product feature, a court case, a quote, or a restaurant that does not exist. It is not usually trying to deceive you — it is doing what it was trained to do: produce a plausible continuation. Sometimes the most plausible-looking continuation is fiction wearing a sensible blazer.",
          "Be especially careful with information that is specific, current, expensive, legal, medical, financial, safety-related, or likely to affect another person. AI can help you prepare questions or summarize verified material; it should not be your final authority.",
          "The practical rule: use AI freely for drafts and ideas. Verify facts, figures, quotes, sources, and consequential decisions.",
        ],
        myth: "If an answer is detailed and confident, it is probably reliable.",
        fact: "Fluency is not evidence. A model can express a correct answer and an invented answer in the same confident tone.",
        tryIt: "Ask an AI for three sources supporting a claim you care about. Open every source. If a link is broken, the author does not exist, or the source says something different, you have just seen why verification is part of AI fluency.",
      },
      {
        heading: "Does it remember you?",
        kind: "memory",
        body: [
          "Within a single conversation, an AI can usually refer back to information you shared earlier. Tell it you are vegetarian, then ask for a dinner idea later in the same chat, and it can use that context.",
          "Across conversations, memory depends on the product and your settings. Some apps offer optional memory features, saved preferences, projects, or custom instructions. Others start a new chat with no personal context at all. Never assume a tool remembers something just because it remembered it five minutes ago.",
          "There is another limit: even in one long conversation, the model can only see a finite amount of text at once. When a chat becomes very long, an app may summarize older material, omit it, or make some details less available. It is not being evasive; it is working within a context window.",
          "For important recurring work, keep a short source-of-truth brief: your goal, audience, preferences, constraints, and relevant facts. Paste or attach it when needed instead of hoping the AI has formed a permanent, flawless picture of you.",
        ],
      },
      {
        heading: "Five terms you'll keep hearing",
        component: "token",
        body: [
          "Prompt — the instruction or material you give the AI. A prompt can be one sentence, a document, a spreadsheet, or a detailed brief. Clear prompts usually lead to less editing.",
          "Token — a small unit of text a model processes. Tokens are not exactly words: a long word may be several tokens, while punctuation can be a token of its own. Providers often measure limits and usage in tokens.",
          "Context window — the amount of information the model can consider in one request or conversation. A larger context window lets you work with more material, but it does not guarantee the model will understand every detail perfectly.",
          "Hallucination — an answer that is plausible but false or unsupported. This can include invented facts, citations, names, or details. It is a reason to verify, not a reason to panic.",
          "Model — the trained system behind an AI product. GPT, Claude, Gemini, and Llama are examples of model families. Different models can vary in writing style, speed, cost, privacy options, tool access, and strengths.",
        ],
      },
      {
        heading: "The important takeaways",
        kind: "nextstep",
        body: [
          "AI is a powerful pattern tool, not a magical truth machine. It can turn rough ideas into drafts, reshape information, explain concepts, and help you explore options at remarkable speed.",
          "Its best role is collaborator, not autopilot. Give it context, tell it what a good answer looks like, and keep responsibility for the final decision. If the result affects money, health, safety, law, reputation, or another person, verify it before acting.",
          "The two biggest beginner mistakes are easy to avoid: trusting a fluent answer as proof, and assuming the AI automatically knows your private context, current events, or personal preferences.",
          "A good habit is to ask yourself: \"Is this a creative or organizational task, or is it a factual claim that needs proof?\" Use AI enthusiastically for the first. Slow down and check the second.",
          "You do not need to understand the mathematics to use AI well. You need a clear goal, useful context, healthy skepticism, and the willingness to edit. That is AI fluency.",
        ],
        tryIt: "Before your next AI task, write one sentence for the goal, one sentence for the audience, and one sentence describing a successful answer. Then ask the AI to draft it. You will immediately get a better result than with \"write something good.\"",
      },
      {
        heading: "Keep this handy",
        component: "cheatsheet",
        body: [
          "Use AI for: first drafts, rewrites, summaries, brainstorming, outlines, translation, explaining, and organizing information you provide.",
          "Pause and verify: precise facts, statistics, citations, quotes, calculations, current events, policies, prices, medical guidance, legal guidance, and financial decisions.",
          "Give it: your goal, audience, relevant context, constraints, examples, and the format you want. \"Write a friendly email\" is vague. \"Write a 120-word friendly update to my project team, using these three points, with a clear next step\" is useful.",
          "Remember: a polished answer is not automatically a correct answer. An AI's confidence is a writing style, not a receipt.",
          "The mindset to keep: use AI to accelerate your thinking and communication — not to outsource your judgment. That is how it becomes a practical tool instead of an impressive demo.",
        ],
      },
    ],
  },
};
