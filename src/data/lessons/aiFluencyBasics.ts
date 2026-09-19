// Real lesson content for "AI Fluency: What It Actually Is" — a guided
// visual story rather than a text-heavy article: every section pairs one
// interactive visual with ~2 short paragraphs, and anything more detailed
// lives behind a "Go deeper" toggle (see GoDeeper.tsx).

export type LessonSection = {
  heading: string;
  component?:
    | "timeline"
    | "dialogue"
    | "ai-nesting"
    | "attention"
    | "data-growth"
    | "hallucination"
    | "transformer"
    | "predictor"
    | "before-after"
    | "memory-chat"
    | "terms-flip"
    | "decision-map"
    | "cheatsheet";
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
    estMinutes: 25,
    sections: [
      {
        heading: "Watch two people talk about AI",
        component: "dialogue",
        body: [
          "The fastest way into this is to hear someone ask the questions you probably have. Click through — Learner asks them plainly, Guide answers without the jargon parade.",
          "By the end, you'll have a mental model that separates hype from reality: AI is extremely good at producing and reshaping language — it is not automatically a source of truth.",
        ],
      },
      {
        heading: "The three layers of AI",
        component: "ai-nesting",
        body: [
          "People use \"AI\" to mean almost anything with a screen and a vaguely futuristic glow. In reality it's four nested ideas, each narrower than the last. Tap a ring above to see what actually lives there.",
          "The short version: AI is the whole field. Machine learning is the most common way it gets built. Deep learning is one powerful kind of machine learning. An LLM — what ChatGPT and Claude actually are — is deep learning trained specifically on text.",
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
          "AI didn't happen because researchers suddenly got smarter. Three ingredients matured at the same time — data, computing power, and a better method for using both — and converged right around 2017–2022.",
          "Before that, the data was piling up mostly unused. Once the method (a Transformer, explained next) could actually use it at scale, everything moved fast.",
        ],
        deeper: [
          "For decades, computers had limited examples to learn from. Then the world started producing digital text, photos, video, code, subtitles, and documentation at a ridiculous pace — a giant, messy library.",
          "Modern language models train on very large collections of text and code — far beyond what a person could read in several lifetimes, though not a perfect copy of the internet; companies mix licensed, public, and created data.",
          "Specialized chips made it possible to train on many examples simultaneously. That, plus the Transformer architecture, is why 2017–2022 is when things suddenly became visible to ordinary people instead of staying in research labs.",
        ],
      },
      {
        heading: "The paper that changed everything",
        component: "attention",
        body: [
          "Toggle the sentence above. Same word, \"bank\" — completely different meaning, depending only on which nearby words it pays attention to. That trick, called attention, is the core idea behind a 2017 paper called \"Attention Is All You Need.\"",
          "Older systems read one word at a time, like reading through a drinking straw. Attention lets a model weigh every word against every other word at once — faster to train, and far better at tracking meaning across a long sentence.",
        ],
        deeper: [
          "That architecture is called a Transformer. GPT means Generative Pre-trained Transformer: a model trained in advance to generate likely text. Many modern systems build on Transformer ideas, even when the products and model names differ.",
          "The breakthrough was not that AI suddenly began \"thinking\" like a human. It gained a far better way to model relationships in data at enormous scale — less cinematic than a robot awakening, but much more useful.",
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
          "Five stops, not fifty. Click any of them — notice the gap between 1956 (AI is named) and 2022 (ChatGPT launches): a slow build, punctuated by \"winters,\" then a sudden convergence.",
          "AI is neither a brand-new fad nor an overnight superintelligence. It's a decades-long research story that became visible once the pieces lined up.",
        ],
      },
      {
        heading: "What you're actually talking to",
        component: "predictor",
        body: [
          "Hit \"Predict again\" above. That's the whole trick: a large language model's job is to predict the next token, over and over, based on patterns it saw during training. \"Paris\" doesn't get looked up — it just wins by a landslide.",
          "That single fact explains most of what works and what doesn't. Prediction is powerful for writing and brainstorming. It's also why the model can't verify facts or remember you between conversations by default.",
        ],
        deeper: [
          "A token is a small chunk of text — sometimes a word, sometimes part of a word or punctuation. Repeated next-token prediction, at large enough scale, produces surprisingly capable behavior: grammar, style, reasoning patterns, code.",
          "The model isn't usually searching a live database each time it answers. Some products add browsing, file search, or calculator tools — but those are add-ons, not the default. A useful mental model: an incredibly well-read improviser, not an all-seeing oracle.",
        ],
        myth: "A chatbot automatically looks up the answer somewhere and reports it back.",
        fact: "A language model normally generates a response from learned patterns and the information in your conversation. It may use live sources only when the product gives it a search or data tool and actually uses that tool.",
      },
      {
        heading: "What it's genuinely good at",
        component: "before-after",
        body: [
          "AI is at its best turning information into a different shape: drafting, restructuring, simplifying. The three cards above are the same trick applied three ways — messy input in, useful output out.",
          "You still own the result. It gets you past the blank page; your judgment does the rest.",
        ],
        deeper: [
          "It can adapt explanations to an audience — ask for compound interest \"for a 10-year-old,\" then \"for a new finance analyst,\" and the vocabulary genuinely changes while the concept stays the same.",
          "It can help you think, too: ask for five ways to structure a presentation, or objections a customer might raise. Treat the output as a starting point for your judgment, not a replacement for it.",
        ],
        tryIt: "Paste three rough bullet points about your week and ask for a warm, five-sentence update for your team. Notice how much editing you still do — that gap is what a good prompting course closes.",
      },
      {
        heading: "Where it quietly fails",
        component: "hallucination",
        body: [
          "Hit \"Check the sources\" above. Before you did, both answers looked equally sure — same tone, same confidence. That's the actual danger: fluency is not evidence.",
          "This is called a hallucination — not a lie, just a plausible-sounding guess with nothing behind it. It shows up most with citations, statistics, dates, and arithmetic.",
        ],
        deeper: [
          "A model may invent a citation, a statistic, a court case, or a restaurant that does not exist. It isn't trying to deceive you — it's doing what it was trained to do: produce a plausible continuation.",
          "Be especially careful with information that is specific, current, legal, medical, financial, or likely to affect another person. AI can help you prepare questions or summarize verified material; it should not be your final authority.",
        ],
        myth: "If an answer is detailed and confident, it is probably reliable.",
        fact: "Fluency is not evidence. A model can express a correct answer and an invented answer in the same confident tone.",
        tryIt: "Ask an AI for three sources supporting a claim you care about. Open every source. If a link is broken or the author doesn't exist, you've just seen why verification is part of AI fluency.",
      },
      {
        heading: "Does it remember you?",
        component: "memory-chat",
        body: [
          "Within one conversation: yes, as shown above. Close the tab and start fresh, and by default it has no idea who you are — the new chat starts blank.",
          "This trips up a lot of new users, who assume the AI learned something permanently and are confused when a new chat doesn't know it.",
        ],
        deeper: [
          "Even within one long conversation, the model can only see a finite amount of text at once — the context window. When a chat gets very long, older parts may drop off or get summarized.",
          "For recurring work, keep a short source-of-truth brief — goal, audience, preferences, key facts — and paste it in when needed, rather than hoping the AI remembers you.",
        ],
      },
      {
        heading: "Five terms you'll keep hearing",
        component: "terms-flip",
        body: [
          "Flip a card above for each one. These five come up constantly once you start using AI tools seriously — worth having solid definitions for.",
        ],
      },
      {
        heading: "The important takeaways",
        component: "decision-map",
        body: [
          "One question does most of the work: is this drafting or organizing, or is it a specific fact or a high-stakes call? The first — go ahead. The second — verify first.",
          "That's the two biggest beginner mistakes, solved: don't trust a fluent answer as proof, and don't assume it remembers your context unless you just told it.",
        ],
        tryIt: "Before your next AI task, write one sentence for the goal, one for the audience, and one describing a successful answer. You'll get a noticeably better result than \"write something good.\"",
      },
      {
        heading: "Keep this handy",
        component: "cheatsheet",
        body: [
          "Everything above, condensed into three columns. Bookmark it — come back whenever you're about to use an AI tool and want a fast reminder.",
        ],
      },
    ],
  },
};
