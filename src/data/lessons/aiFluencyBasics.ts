// Real lesson content for "AI Fluency: What It Actually Is" — condensed,
// de-duplicated, with interactive dialogue and SVG diagrams to replace
// text-heavy explanations. Assumes zero AI background.

import type { LessonAnimationKind } from "@/components/LessonAnimation";

export type LessonSection = {
  heading: string;
  kind?: LessonAnimationKind;
  component?: "timeline" | "dialogue" | "ai-nesting" | "attention" | "data-growth" | "token" | "hallucination" | "transformer" | "cheatsheet";
  body: string[];
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
          "The fastest way to understand AI is to hear someone explain it. Click through — Learner asks the questions you probably have, and Guide answers them plainly.",
          "By the time you finish this course, you'll have the mental model that separates hype from reality. You won't be fooled by vendors, and you'll know exactly what to ask an AI to get useful work done. That's the foundation for every other skill — from prompting to building with AI.",
        ],
      },
      {
        heading: "The three layers of AI",
        component: "ai-nesting",
        body: [
          "When people say \"AI,\" they often mean three different things. The diagram above shows how they nest inside each other.",
          "Artificial Intelligence is the broad umbrella — anything a computer does that looks like it needs human smarts. Your phone's autocomplete is AI. So is your Netflix recommendation. So is ChatGPT.",
          "Machine Learning is the technique that powers most AI today. Instead of programming rules by hand (\"if email says 'winner', mark it spam\"), you show the system examples and let it find the patterns itself. Your phone learned which words go together by seeing millions of texts. A spam filter learned what spam looks like by seeing millions of emails.",
          "Deep Learning is when you build the system from many layers of connected pieces (called neural networks). This is what ChatGPT, Gemini, and Claude use. It's more powerful than simpler ML, but it also needs way more examples and computing power to train.",
          "The key difference: traditional ML does one narrow job well. Deep learning does many different jobs with one model — the same ChatGPT writes emails, codes, translates, explains jokes, all in one conversation.",
        ],
        myth: "AI, machine learning, and ChatGPT are basically the same thing.",
        fact: "They're nested: AI is the whole field, ML is how most modern AI works, and ChatGPT is one specific, very large kind of ML called a large language model (LLM).",
        tryIt: "Think of one AI thing you use without calling it AI — a spam filter, autocomplete, a recommendation. That's usually traditional ML. Now compare it to ChatGPT. One does one job, the other does many. That's the real difference.",
      },
      {
        heading: "Why did this happen now?",
        component: "data-growth",
        body: [
          "None of this became possible because researchers got smarter. It became possible because, for the first time in history, there was enough data.",
          "In the 1990s, the internet existed but there were only a few million pages. By the 2010s, you had billions of websites, Wikipedia, digitized books, social media, and code repositories. By 2020, we had trillions of words and billions of captioned images.",
          "A modern large language model trains on this entire corpus — all of it at once. It learned language patterns from more text than exists in all the libraries in the world, combined. That's the raw material ChatGPT needed to be useful for anything you ask it.",
          "The timing matters: the breakthrough in AI architecture (the Transformer, explained next) arrived exactly when the data became available to use it. Before that, the data was piling up unused. After, it became explosive.",
        ],
      },
      {
        heading: "The paper that changed everything",
        component: "attention",
        body: [
          "In 2017, researchers published a paper called \"Attention Is All You Need.\" It introduced a new way for AI to read and understand text — by paying attention to which words matter most.",
          "Old approach: read one word at a time, in order. By the end of a long sentence, forget the beginning. Slow to train.",
          "New approach (Attention): look at all words at once, and learn which ones are important to understanding each other. In \"The bank raised interest rates,\" understanding \"bank\" means weighing \"raised,\" \"interest,\" and \"rates\" heavily. Ignore \"the.\"",
          "Why it mattered: this design (called a Transformer) could be trained fast and in parallel on huge amounts of data. It finally let researchers use all the data piling up since the 90s.",
          "GPT, BERT, Gemini, Claude — all built on this same core idea. \"GPT\" = Generative Pre-trained Transformer. One architectural insight, plus the timing of data availability, explains most of the jump from 2017 to today.",
        ],
        myth: "AI got dramatically better because computers got dramatically faster.",
        fact: "Hardware helped, but the bigger unlock was a 2017 architectural idea (Transformers) that let models actually use the data that had been accumulating for two decades.",
      },
      {
        heading: "The breakthrough visualization",
        component: "transformer",
        body: [
          "This is what changed. The old way read text word-by-word in sequence — slow and memory-limited. The new Transformer approach looks at everything at once and learns which words matter for understanding each other. This seemingly small change meant models could finally use billions of examples of text, not just thousands.",
        ],
      },
      {
        heading: "How we got here",
        component: "timeline",
        body: [
          "Here's the actual sequence — research breakthroughs, company founding dates, product launches. Notice the gap from 1956 (AI is named) to 2022 (ChatGPT launches): a slow build, then a sudden explosion once everything aligned.",
        ],
      },
      {
        heading: "What you're actually talking to",
        kind: "predict",
        body: [
          "When you use ChatGPT, you're talking to a large language model. Its job is to predict the next word, over and over, based on what usually comes after the words it's already seen.",
          "Type \"The capital of France is\" and it says \"Paris\" because in the text it trained on, \"Paris\" is overwhelmingly the word that follows. It's not looking it up. It's predicting based on patterns. That's it.",
          "This single fact explains most of what works and what doesn't. Prediction is powerful — you can use it to write, explain, brainstorm. It's also limited — it can't actually remember you between conversations, and it can't verify facts without being told.",
        ],
        myth: "It's a search engine looking things up for you.",
        fact: "By default, it's not connected to the internet or any database. It's generating answers from patterns it learned during training, which ended at a fixed date in the past.",
      },
      {
        heading: "What it's genuinely good at",
        kind: "draft",
        body: [
          "First drafts. Type rough notes — \"q3 up, need email 2 team by fri\" — and ask it to turn that into a polished email. You get: \"Hi team — Q3 results are in. I'll send the full breakdown by Friday.\" Not perfect, but you skipped the blank page.",
          "Explaining concepts different ways. Ask it to explain compound interest to a 10-year-old, then to an accountant. You get two genuinely different answers, because rephrasing for an audience is exactly what it does well.",
          "Restructuring what you give it. Paste ten messy meeting notes and ask for a table sorted by owner and deadline. It rearranges without needing new information.",
        ],
        tryIt: "Paste three bullet points about your week and ask for a short work update email. Notice how much editing you still need to do. That gap is what Prompting That Actually Works (the next course) teaches you to close.",
      },
      {
        heading: "Where it quietly fails",
        component: "hallucination",
        body: [
          "It sounds confident while being wrong. Ask for a specific statistic, a book's page count, a court case details, and it'll invent plausible-sounding numbers with the same tone as when it's right. This is called a hallucination — not a lie, just prediction without verification. The diagram above shows exactly this: both answers sound equally confident, but one is invented.",
          "It's unreliable at arithmetic. Multiply two large random numbers and it guesses at a plausible-looking answer, not calculating. It can't verify facts without being told.",
          "It doesn't know anything after its training cutoff unless you give it a search tool and it tells you it used it.",
          "Lesson: don't trust specific, checkable claims without verifying. Use it for structure and reasoning, not facts.",
        ],
        myth: "If it states something clearly and confidently, it's probably right.",
        fact: "Confidence and accuracy are unrelated. Both a right answer and a wrong one sound equally sure, because it's predicting plausible-sounding text, not verifying.",
      },
      {
        heading: "Does it remember you?",
        kind: "memory",
        body: [
          "Within one conversation, yes. Tell it you're vegetarian early in a chat, ask for a recipe 20 messages later, and it remembers because the whole conversation is visible to it.",
          "Close the tab and start fresh, and it has no idea. The model has no persistent memory of you between chats unless the app (ChatGPT Memory, Claude Projects) explicitly tells you it saved something.",
          "This trips up a lot of new users — they assume the AI learned something about them permanently, then are confused when a new chat doesn't know.",
        ],
      },
      {
        heading: "Five terms you'll keep hearing",
        component: "token",
        body: [
          "Prompt — what you type. How you phrase it matters way more than most people expect.",
          "Token — roughly a word-piece, not a whole word. The diagram above shows how \"Unbelievable\" breaks into 3 tokens. Models count and charge by tokens, not words — so longer text = more tokens = more cost or more of your context window used.",
          "Context window — how much text the model can see at once. When you paste a long document, it forgets the earliest parts to make room for new ones. Measured in tokens, not words.",
          "Hallucination — confident, wrong answer. Covered in the previous section with visual examples.",
          "Model — the actual trained system. GPT-4, Gemini, Claude, Llama are different models from different companies with different strengths.",
        ],
      },
      {
        heading: "What to do next",
        kind: "nextstep",
        body: [
          "You now understand what AI is, why it happened when it did, the core idea that made it work, and where it fails. You know the two biggest beginner mistakes: trusting facts without checking, and expecting memory that was never there.",
          "The next skill — how to actually phrase what you want so the first draft needs less editing — is its own course: \"Prompting That Actually Works.\" It teaches the 5 patterns that separate a good prompt from a wasted prompt. Learning to prompt is where AI goes from impressive demo to actually saving you time.",
          "If you're in engineering or thinking about GenAI roles, \"GenAI Engineer Fundamentals\" teaches the technical side: how models are built, deployed, and integrated into products. It's the bridge from \"I can use ChatGPT\" to \"I can build with AI.\"",
        ],
      },
      {
        heading: "Keep this handy",
        component: "cheatsheet",
        body: [
          "This cheat sheet summarizes everything above in six categories. Bookmark it or come back to it whenever you're using an AI tool and want a quick reminder of what it's actually good at and where it falls short.",
          "You've just learned more about how AI actually works than most people using it every day. This clarity — knowing exactly what to ask, when to verify, and where it falls short — is what transforms AI from a toy into a tool.",
          "Ready to actually build with AI, or get better at prompting? That's what the next courses teach. Start with whichever fits your path: learn to prompt better, or understand the engineering side.",
        ],
      },
    ],
  },
};
