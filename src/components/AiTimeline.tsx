// A real, accurate timeline of AI milestones — research breakthroughs,
// company founding dates, and product launches — color-coded by category so
// the pattern (research → company → product, repeating) reads at a glance.
// Static content, CSS-only stagger-in animation, no chart library needed.

type Milestone = {
  year: string;
  label: string;
  category: "research" | "company" | "product";
};

const MILESTONES: Milestone[] = [
  { year: "1956", label: "The term \"Artificial Intelligence\" is coined at the Dartmouth Conference.", category: "research" },
  { year: "1980s", label: "Expert systems and early neural networks (ANNs) are developed.", category: "research" },
  { year: "1997", label: "IBM's Deep Blue beats world chess champion Garry Kasparov.", category: "product" },
  { year: "1997", label: "LSTMs (Long Short-Term Memory networks) invented — breakthrough in sequence modeling.", category: "research" },
  { year: "2012", label: "Deep learning breakthrough: AlexNet wins image recognition by a huge margin.", category: "research" },
  { year: "2015", label: "OpenAI is founded.", category: "company" },
  { year: "2016", label: "RNNs (Recurrent Neural Networks) and LSTMs scale to language — early pre-training begins.", category: "research" },
  { year: "2017", label: "\"Attention Is All You Need\" introduces the Transformer architecture — a turning point.", category: "research" },
  { year: "2018", label: "Transformer-based models (BERT, GPT-1) launch — the practical era begins.", category: "product" },
  { year: "2020", label: "GPT-3 shows one model can do many different tasks reasonably well (few-shot learning).", category: "product" },
  { year: "2021", label: "Anthropic is founded.", category: "company" },
  { year: "2022", label: "ChatGPT launches publicly — 100 million users within two months. GenAI becomes mainstream.", category: "product" },
  { year: "2023", label: "GPT-4, Claude, Gemini arrive. Function calling & tool use emerge.", category: "product" },
  { year: "2024", label: "Agentic AI: models use tools, take multi-step actions, and reason autonomously.", category: "research" },
];

const CATEGORY_STYLE: Record<Milestone["category"], string> = {
  research: "bg-accent2 border-accent2",
  company: "bg-rust border-rust",
  product: "bg-accent-ink border-accent-ink",
};

const CATEGORY_LABEL: Record<Milestone["category"], string> = {
  research: "Research breakthrough",
  company: "Company founded",
  product: "Product launch",
};

export default function AiTimeline() {
  return (
    <div className="border border-paper-line rounded p-4">
      <div className="flex gap-4 mb-4 flex-wrap">
        {(Object.keys(CATEGORY_LABEL) as Milestone["category"][]).map((cat) => (
          <div key={cat} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${CATEGORY_STYLE[cat]}`} />
            <span className="font-mono text-[10px] text-ink-soft">{CATEGORY_LABEL[cat]}</span>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <div className="relative flex gap-6 pb-2 min-w-max">
          <div className="absolute left-0 right-0 top-[7px] h-px bg-paper-line" aria-hidden />
          {MILESTONES.map((m, i) => (
            <div
              key={m.year}
              className="motion-safe:animate-layer-reveal relative flex flex-col items-start w-40 flex-none"
              style={{ animationDelay: `${i * 0.15}s`, animationDuration: "9s" }}
            >
              <span className={`w-3.5 h-3.5 rounded-full border-2 ${CATEGORY_STYLE[m.category]} mb-2`} />
              <span className="font-mono text-xs font-semibold text-accent-ink mb-1">{m.year}</span>
              <p className="text-xs text-ink-soft leading-snug">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
