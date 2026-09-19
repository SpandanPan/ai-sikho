"use client";

// Phase 2 of the AI Fluency lesson redesign: the remaining seven sections
// get the same treatment as PriorityVisuals.tsx (one striking, interactive
// visual per section) using the same navy/cream editorial palette.

import { useState } from "react";
import { LV } from "./lessonVisualTheme";

const p2Styles = `
  @keyframes p2Pop {
    0% { transform: scale(0.85); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }
  .p2-pop { animation: p2Pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

  @keyframes p2Rise {
    0% { transform: scaleY(0); }
    100% { transform: scaleY(1); }
  }
  .p2-rise { animation: p2Rise 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; transform-origin: bottom; }

  @keyframes p2FillBar {
    0% { width: 0%; }
    100% { width: var(--pct); }
  }
  .p2-fill { animation: p2FillBar 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
`;

function VisualCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full rounded-2xl p-5 sm:p-6" style={{ background: LV.bg, border: `1px solid ${LV.border}` }}>
      <style>{p2Styles}</style>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------
// 1. Three ingredients converging — data, compute, methods, ~2017-2022
// ---------------------------------------------------------------------

const INGREDIENTS = [
  { key: "data", label: "Data", color: LV.blue, caption: "The internet became a giant training set" },
  { key: "compute", label: "Computing Power", color: LV.violet, caption: "Specialized chips made huge training runs possible" },
  { key: "methods", label: "Better Methods", color: LV.green, caption: "The Transformer gave models a way to use it all" },
];

export function IngredientsConvergeChart() {
  return (
    <VisualCard>
      <div className="grid grid-cols-3 gap-3 sm:gap-5 mb-5">
        {INGREDIENTS.map((ing, i) => (
          <div key={ing.key} className="flex flex-col items-center">
            <svg viewBox="0 0 60 40" className="w-full h-10 mb-2">
              <polyline points="4,36 20,26 38,16 56,4" fill="none" stroke={ing.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-xs sm:text-sm font-semibold text-center" style={{ color: ing.color }}>
              {ing.label}
            </p>
            <div
              className="p2-rise w-1.5 rounded-full mt-2"
              style={{ height: `${24 + i * 6}px`, background: ing.color, animationDelay: `${i * 0.15}s` }}
            />
          </div>
        ))}
      </div>

      {/* Converging lines into a single highlighted window */}
      <svg viewBox="0 0 300 70" className="w-full h-auto">
        {INGREDIENTS.map((ing, i) => {
          const startX = 50 + i * 100;
          return (
            <path
              key={ing.key}
              d={`M ${startX} 4 Q 150 40 150 60`}
              fill="none"
              stroke={ing.color}
              strokeWidth="2"
              opacity="0.6"
            />
          );
        })}
        <circle cx="150" cy="62" r="6" fill={LV.coral} />
      </svg>
      <p className="text-center mt-1">
        <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ background: LV.coralSoft, color: LV.coral }}>
          2017–2022 · everything lines up
        </span>
      </p>

      <div className="mt-4 flex flex-col gap-1.5">
        {INGREDIENTS.map((ing) => (
          <p key={ing.key} className="text-xs flex items-start gap-2" style={{ color: LV.inkOnNavySoft }}>
            <span aria-hidden style={{ color: ing.color }}>
              ●
            </span>
            {ing.caption}
          </p>
        ))}
      </div>
    </VisualCard>
  );
}

// ---------------------------------------------------------------------
// 2. Timeline as a visual path — 5 big stops, click to expand
// ---------------------------------------------------------------------

const PATH_STOPS = [
  { year: "1956", label: "AI is named", color: LV.violet, detail: "The term \"Artificial Intelligence\" is coined at the Dartmouth Conference — decades before it could do much of anything." },
  { year: "1970s–80s", label: "AI winters", color: LV.inkOnNavySoft, detail: "Funding dries up more than once when early promises outrun what the technology can actually deliver." },
  { year: "2012", label: "Deep learning breaks through", color: LV.blue, detail: "AlexNet wins an image-recognition contest by a huge margin — the modern deep-learning era begins." },
  { year: "2017", label: "Transformers arrive", color: LV.green, detail: "\"Attention Is All You Need\" introduces the architecture behind every major model since." },
  { year: "2022", label: "ChatGPT goes public", color: LV.coral, detail: "100 million users in two months. A technology that lived in labs and back-office systems gets a front door." },
];

export function TimelinePathVisual() {
  const [selected, setSelected] = useState(4);
  const active = PATH_STOPS[selected];

  return (
    <VisualCard>
      <div className="overflow-x-auto pb-1">
        <div className="relative flex items-start gap-4 min-w-max px-1 pt-2">
          <div className="absolute left-4 right-4 top-6 h-0.5" style={{ background: LV.border }} aria-hidden />
          {PATH_STOPS.map((stop, i) => (
            <button
              key={stop.year}
              onClick={() => setSelected(i)}
              className="relative flex flex-col items-center gap-2 w-24 flex-none"
            >
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all"
                style={{
                  background: selected === i ? stop.color : LV.bgRaised,
                  color: selected === i ? LV.bg : stop.color,
                  border: `2px solid ${stop.color}`,
                  transform: selected === i ? "scale(1.15)" : "scale(1)",
                }}
              >
                {i + 1}
              </span>
              <span className="font-mono text-[10px] font-semibold" style={{ color: stop.color }}>
                {stop.year}
              </span>
              <span className="text-[10.5px] text-center leading-snug" style={{ color: LV.inkOnNavySoft }}>
                {stop.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div key={selected} className="p2-pop mt-4 rounded-xl p-4" style={{ background: LV.bgRaised, borderLeft: `3px solid ${active.color}` }}>
        <p className="text-sm" style={{ color: LV.inkOnNavy }}>
          {active.detail}
        </p>
      </div>
    </VisualCard>
  );
}

// ---------------------------------------------------------------------
// 3. Live next-word predictor — probability bars, one playful wrong option
// ---------------------------------------------------------------------

const PREDICTIONS = [
  { word: "Paris", pct: 92, color: LV.green },
  { word: "London", pct: 5, color: LV.blue },
  { word: "croissant 🥐", pct: 1, color: LV.coral },
];

export function NextWordPredictor() {
  const [round, setRound] = useState(0);

  return (
    <VisualCard>
      <p className="font-mono text-sm mb-4" style={{ color: LV.inkOnNavy }}>
        &ldquo;The capital of France is <span style={{ color: LV.violet }}>…</span>&rdquo;
      </p>
      <div key={round} className="flex flex-col gap-2.5">
        {PREDICTIONS.map((p, i) => (
          <div key={p.word} className="flex items-center gap-3">
            <span className="w-24 flex-none text-xs font-semibold text-right" style={{ color: LV.inkOnNavy }}>
              {p.word}
            </span>
            <div className="flex-1 h-5 rounded-full overflow-hidden" style={{ background: LV.bgRaised }}>
              <div
                className="p2-fill h-full rounded-full"
                style={{ "--pct": `${p.pct}%`, background: p.color, animationDelay: `${i * 0.12}s` } as React.CSSProperties}
              />
            </div>
            <span className="w-9 flex-none text-xs font-mono" style={{ color: p.color }}>
              {p.pct}%
            </span>
          </div>
        ))}
      </div>
      <button
        onClick={() => setRound((r) => r + 1)}
        className="mt-4 rounded-full px-4 py-2 text-xs font-semibold"
        style={{ background: LV.violet, color: LV.bg }}
      >
        Predict again
      </button>
      <p className="font-mono text-[10.5px] mt-3" style={{ color: LV.inkOnNavySoft }}>
        Not a lookup — a probability. &ldquo;Paris&rdquo; just wins by a landslide.
      </p>
    </VisualCard>
  );
}

// ---------------------------------------------------------------------
// 4. Before / after cards — what AI is genuinely good at
// ---------------------------------------------------------------------

const BEFORE_AFTER = [
  {
    label: "Messy notes → polished email",
    before: "\"q3 sales up, thank team, report friday\"",
    after: "\"Hi team — Q3 results are in and they're strong. Thank you for the effort this quarter. I'll share the full report Friday.\"",
  },
  {
    label: "Scattered notes → a table",
    before: "\"Sarah: redesign homepage by 6/12. Tom: fix checkout bug. Priya: no deadline yet on the API docs.\"",
    after: "Owner | Task | Deadline\nSarah | Redesign homepage | 6/12\nTom | Fix checkout bug | —\nPriya | API docs | —",
  },
  {
    label: "Complicated concept → simple explanation",
    before: "\"Compound interest is interest calculated on the initial principal and also on the accumulated interest of previous periods.\"",
    after: "\"Money on money. Your interest starts earning its own interest too.\"",
  },
];

export function BeforeAfterCards() {
  return (
    <VisualCard>
      <div className="grid sm:grid-cols-3 gap-3">
        {BEFORE_AFTER.map((item) => (
          <div key={item.label} className="rounded-xl p-3.5 flex flex-col gap-2.5" style={{ background: LV.bgRaised }}>
            <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: LV.inkOnNavySoft }}>
              {item.label}
            </p>
            <div className="rounded-lg p-2.5 text-xs whitespace-pre-line" style={{ background: LV.surfaceMuted, color: LV.ink, opacity: 0.75 }}>
              {item.before}
            </div>
            <span className="text-center text-sm" style={{ color: LV.green }} aria-hidden>
              ↓
            </span>
            <div className="rounded-lg p-2.5 text-xs whitespace-pre-line font-medium" style={{ background: LV.surface, color: LV.ink, border: `1.5px solid ${LV.green}` }}>
              {item.after}
            </div>
          </div>
        ))}
      </div>
    </VisualCard>
  );
}

// ---------------------------------------------------------------------
// 5. Memory chat timeline — same chat remembers, new chat resets
// ---------------------------------------------------------------------

function ChatBubble({ from, text }: { from: "user" | "ai"; text: string }) {
  return (
    <div
      className="rounded-lg px-3 py-2 text-xs max-w-[85%]"
      style={{
        alignSelf: from === "user" ? "flex-end" : "flex-start",
        background: from === "user" ? LV.blueSoft : LV.surface,
        color: from === "user" ? LV.blue : LV.ink,
      }}
    >
      {text}
    </div>
  );
}

export function MemoryChatTimeline() {
  return (
    <VisualCard>
      <div className="rounded-xl p-3.5 mb-3" style={{ background: LV.bgRaised, border: `1.5px solid ${LV.blue}` }}>
        <p className="font-mono text-[10px] uppercase tracking-widest mb-2.5" style={{ color: LV.blue }}>
          Same conversation — memory active
        </p>
        <div className="flex flex-col gap-2">
          <ChatBubble from="user" text="I'm vegetarian, by the way." />
          <ChatBubble from="ai" text="Noted — I'll keep that in mind." />
          <ChatBubble from="user" text="Suggest something for dinner?" />
          <ChatBubble from="ai" text="Since you're vegetarian, try a chickpea curry." />
        </div>
      </div>

      <div className="flex items-center gap-2 my-3" aria-hidden>
        <div className="flex-1 h-px" style={{ background: LV.border }} />
        <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: LV.coral }}>
          New chat — memory resets
        </span>
        <div className="flex-1 h-px" style={{ background: LV.border }} />
      </div>

      <div className="rounded-xl p-3.5" style={{ background: LV.bgRaised, border: `1.5px solid ${LV.coral}` }}>
        <div className="flex flex-col gap-2">
          <ChatBubble from="user" text="Suggest something for dinner?" />
          <ChatBubble from="ai" text="Sure! Any dietary preferences I should know about?" />
        </div>
      </div>

      <p className="font-mono text-[10.5px] mt-3" style={{ color: LV.inkOnNavySoft }}>
        Some apps (ChatGPT Memory, Claude Projects) can remember across chats if you turn that on — it's not the default.
      </p>
    </VisualCard>
  );
}

// ---------------------------------------------------------------------
// 6. Flip cards — five terms
// ---------------------------------------------------------------------

const TERMS = [
  { term: "Prompt", icon: "⌨️", def: "What you type. How you phrase it matters more than most people expect.", color: LV.violet },
  { term: "Token", icon: "🧩", def: "A word-piece, not a whole word. Models count and charge by tokens.", color: LV.blue },
  { term: "Context Window", icon: "🪟", def: "How much text the model can see at once — older parts drop off when it's full.", color: LV.green },
  { term: "Hallucination", icon: "👻", def: "A confident, wrong answer. Not a lie — a plausible guess with nothing behind it.", color: LV.coral },
  { term: "Model", icon: "⚙️", def: "The trained system itself — GPT, Claude, Gemini, Llama are all different models.", color: LV.violet },
];

function FlipCard({ term, icon, def, color }: (typeof TERMS)[number]) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      onClick={() => setFlipped((f) => !f)}
      className="relative h-28 rounded-xl text-left"
      style={{ perspective: "800px" }}
      aria-pressed={flipped}
    >
      <div
        className="absolute inset-0 rounded-xl transition-transform duration-500"
        style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        <div
          className="absolute inset-0 rounded-xl flex flex-col items-center justify-center gap-1.5 p-2"
          style={{ background: LV.bgRaised, border: `1.5px solid ${color}`, backfaceVisibility: "hidden" }}
        >
          <span className="text-xl" aria-hidden>
            {icon}
          </span>
          <span className="text-xs font-semibold text-center" style={{ color }}>
            {term}
          </span>
          <span className="font-mono text-[9px]" style={{ color: LV.inkOnNavySoft }}>
            tap to flip
          </span>
        </div>
        <div
          className="absolute inset-0 rounded-xl flex items-center justify-center p-3"
          style={{ background: color, backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <p className="text-[11px] leading-snug text-center font-medium" style={{ color: LV.bg }}>
            {def}
          </p>
        </div>
      </div>
    </button>
  );
}

export function TermFlipCards() {
  return (
    <VisualCard>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {TERMS.map((t) => (
          <FlipCard key={t.term} {...t} />
        ))}
      </div>
    </VisualCard>
  );
}

// ---------------------------------------------------------------------
// 7. Decision map — the important takeaways, as a flowchart
// ---------------------------------------------------------------------

export function DecisionMap() {
  return (
    <VisualCard>
      <div className="flex flex-col items-center">
        <div className="rounded-xl px-4 py-2.5 text-sm font-semibold text-center" style={{ background: LV.bgRaised, color: LV.inkOnNavy, border: `1.5px solid ${LV.violet}` }}>
          What are you about to do?
        </div>

        <svg viewBox="0 0 260 50" className="w-full max-w-[260px] h-10">
          <path d="M 130 0 Q 130 25 40 45" fill="none" stroke={LV.green} strokeWidth="2" />
          <path d="M 130 0 Q 130 25 220 45" fill="none" stroke={LV.coral} strokeWidth="2" />
        </svg>

        <div className="grid sm:grid-cols-2 gap-3 w-full">
          <div className="rounded-xl p-3.5" style={{ background: LV.greenSoft, border: `1.5px solid ${LV.green}` }}>
            <p className="text-xs font-semibold mb-1" style={{ color: LV.green }}>
              Drafting, brainstorming, organizing
            </p>
            <p className="text-sm font-bold" style={{ color: LV.green }}>
              ✅ Go ahead
            </p>
          </div>
          <div className="rounded-xl p-3.5" style={{ background: LV.coralSoft, border: `1.5px solid ${LV.coral}` }}>
            <p className="text-xs font-semibold mb-1" style={{ color: LV.coral }}>
              Specific fact or high-stakes decision
            </p>
            <p className="text-sm font-bold" style={{ color: LV.coral }}>
              🔍 Verify first
            </p>
          </div>
        </div>
      </div>
    </VisualCard>
  );
}
