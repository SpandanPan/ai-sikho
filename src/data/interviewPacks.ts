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
};

export const interviewPacks: InterviewPackTrack[] = [
  {
    slug: "genai-engineer",
    title: "GenAI Engineer",
    summary: "LLM APIs, RAG, prompt/context engineering, evals, and the system-design questions that come up most.",
    starterPriceInPaise: 10000, // ₹100
    kitPriceInPaise: 99900, // ₹999
    kitContents: "100 questions, 30 system-design scenarios, 10 diagrams, 5 checklists",
  },
  {
    slug: "agentic-ai",
    title: "Agentic AI",
    summary: "Tool use, multi-step planning, memory, agent-to-agent orchestration, and where agents actually fail.",
    starterPriceInPaise: 10000,
    kitPriceInPaise: 99900,
    kitContents: "90 questions, 25 agent-design scenarios, 10 failure-mode case studies, 5 checklists",
  },
  {
    slug: "data-scientist",
    title: "Data Scientist",
    summary: "Statistics fundamentals, experiment design, classical ML trade-offs, and the take-home-assignment pattern.",
    starterPriceInPaise: 10000,
    kitPriceInPaise: 99900,
    kitContents: "100 questions, 20 case-study prompts, 10 SQL/stats drills, 5 checklists",
  },
  {
    slug: "data-engineering",
    title: "Data Engineering",
    summary: "Pipeline design, batch vs. streaming, orchestration, data quality, and the system-design questions specific to data platforms.",
    starterPriceInPaise: 10000,
    kitPriceInPaise: 99900,
    kitContents: "90 questions, 25 pipeline system-design scenarios, 10 diagrams, 5 checklists",
  },
];

export function formatPackPrice(paise: number) {
  return `₹${(paise / 100).toFixed(0)}`;
}
