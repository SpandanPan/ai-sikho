// Same pattern as courses.ts: hardcoded for v0, mirrors the shape a real
// Purchase row needs (see Purchase.packTrack in prisma/schema.prisma).
//
// Pricing is deliberately uniform across tracks (₹100 Starter / ₹999 Kit,
// same as the original GenAI Engineer pack) rather than charging more for
// "hotter" tracks like Agentic AI — there's no actual difference in
// content depth between tracks yet to justify a different price, and
// pricing by hype rather than substance is the kind of thing that reads as
// a bait-and-switch once someone buys it. Revisit per-track pricing once a
// track's kit genuinely has more (or less) in it than the others.
export type InterviewPackTrack = {
  slug: string;
  title: string;
  summary: string;
  starterPriceInPaise: number;
  kitPriceInPaise: number;
  kitContents: string; // shown on the kit card, e.g. "100 questions, 30 scenarios..."
  // Product-detail-page copy (/pack/[slug]/[variant]) — drafted by the
  // local Ollama agent (scripts/generate-product-descriptions.ts,
  // src/lib/contentAgent.ts's generateProductDescription), reviewed by
  // hand before landing here, same standard as every other AI-drafted
  // content in this app. starterDescription is deliberately plain-
  // language (beginner audience); kitDescription assumes technical
  // familiarity (candidate already prepping for the role).
  starterDescription: string;
  kitDescription: string;
};

export const interviewPacks: InterviewPackTrack[] = [
  {
    slug: "genai-engineer",
    title: "GenAI Engineer",
    summary: "LLM APIs, RAG, prompt/context engineering, evals, and the system-design questions that come up most.",
    starterPriceInPaise: 10000, // ₹100
    kitPriceInPaise: 99900, // ₹999
    kitContents: "100 questions, 30 system-design scenarios, 10 diagrams, 5 checklists",
    starterDescription: "Ready to build with AI, but don't know how to code? This Starter Pack gives you a clear, non-technical first look at creating smart applications that use natural language and external data — without diving into complex code, you'll see the exact steps needed to test an AI's performance and design robust, real-world systems. It's the perfect place to start turning big AI ideas into working products.",
    kitDescription: "Master the full spectrum of GenAI system implementation with this intensive interview kit, designed to move beyond definitions into robust architecture. It covers 100 highly situational questions and 30 critical system-design scenarios, focusing heavily on practical implementations of RAG, advanced prompt/context engineering, and modern LLM APIs. Comprehensive resources — 10 diagrams and 5 actionable checklists — ensure mastery of core concepts, including advanced evaluation strategies (evals), preparing you for the holistic, deeply technical systems-design components top-tier GenAI engineering roles actually test for.",
  },
  {
    slug: "agentic-ai",
    title: "Agentic AI",
    summary: "Tool use, multi-step planning, memory, agent-to-agent orchestration, and where agents actually fail.",
    starterPriceInPaise: 10000,
    kitPriceInPaise: 99900,
    kitContents: "90 questions, 25 agent-design scenarios, 10 failure-mode case studies, 5 checklists",
    starterDescription: "Used to make AI systems move beyond simple chat responses and become truly useful assistants. This Starter Pack teaches you how to structure complex instructions, letting AI plan multiple steps and use tools — like browsing the web — to get real-time answers. You'll see how systems remember past conversations and even make several different AI \"brains\" work together, and walk away knowing how agents fail predictably, not just how they succeed.",
    kitDescription: "Move beyond foundational prompting with this Agentic AI Interview Kit, designed to validate system-design understanding. It provides 90 advanced questions and 25 complex scenarios covering critical competencies like multi-step planning, memory management, and agent-to-agent orchestration. The included failure-mode case studies ensure you can articulate where agents actually break down — key for deep system-architecture interviews — covering the full lifecycle from robust tool invocation to mitigating real-world design flaws.",
  },
  {
    slug: "data-scientist",
    title: "Data Scientist",
    summary: "Statistics fundamentals, experiment design, classical ML trade-offs, and the take-home-assignment pattern.",
    starterPriceInPaise: 10000,
    kitPriceInPaise: 99900,
    kitContents: "100 questions, 20 case-study prompts, 10 SQL/stats drills, 5 checklists",
    starterDescription: "This Starter Pack is your no-stress guide to understanding the world of data. You won't write a single line of code, but you'll learn how to take complex, raw information and turn it into clear, actionable insights — the essential logic needed to structure real-world problems, design solid tests, and analyze data like a professional. By the end, you'll be ready to tackle data challenges and confidently see the potential hidden within any information set.",
    kitDescription: "This kit provides comprehensive readiness for the Data Scientist interview, including 100 targeted questions and 20 applied case studies. Drill foundational knowledge in statistics and experiment design, and learn to articulate classical ML trade-offs in depth. It includes dedicated SQL/stats modules and proven checklists for the exact take-home-assignment pattern most companies use — mastering these components lets you pivot from theory to rigorous, production-ready engineering discussion.",
  },
  {
    slug: "data-engineering",
    title: "Data Engineering",
    summary: "Pipeline design, batch vs. streaming, orchestration, data quality, and the system-design questions specific to data platforms.",
    starterPriceInPaise: 10000,
    kitPriceInPaise: 99900,
    kitContents: "90 questions, 25 pipeline system-design scenarios, 10 diagrams, 5 checklists",
    starterDescription: "If you want to build with data, you first need to know how to manage it. This Starter Pack doesn't teach code, but it teaches the expert thinking behind building reliable data systems — the step-by-step blueprint for moving data accurately, whether it's coming in a constant stream or in massive, scheduled batches. After this, you'll know exactly how to structure and design the robust systems experts use to power modern applications.",
    kitDescription: "A comprehensive resource for advanced Data Engineering roles, moving beyond surface-level theory. The kit provides 90 technical questions and 25 deep-dive pipeline system-design scenarios, complete with diagrams and checklists for systematic review. Coverage is structured around critical domains — complex orchestration patterns, data quality enforcement, and the architectural nuances between batch and real-time streaming pipelines — to confidently tackle the system-level architecture discussions top-tier data platform roles require.",
  },
];

export function formatPackPrice(paise: number) {
  return `₹${(paise / 100).toFixed(0)}`;
}
