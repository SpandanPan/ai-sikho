"use client";

// The three (four, counting the transformer split-screen as its own
// visual) priority interactive diagrams for the AI Fluency lesson redesign:
// nested-circle layers with click-to-reveal examples, an attention
// sentence demo with a financial/river toggle, an old-vs-new split-screen
// comparison, and a "confidence looks the same either way" hallucination
// comparison. Deliberately built with the lesson's own navy/cream palette
// (see lessonVisualTheme.ts) rather than the site's theme tokens.

import { useState } from "react";
import { LV } from "./lessonVisualTheme";

const visualStyles = `
  @keyframes lvCircleIn {
    0% { opacity: 0; transform: scale(0.7); }
    100% { opacity: 1; transform: scale(1); }
  }
  .lv-circle { animation: lvCircleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) backwards; }

  @keyframes lvArcDraw {
    0% { stroke-dashoffset: 240; opacity: 0; }
    30% { opacity: 1; }
    100% { stroke-dashoffset: 0; opacity: 1; }
  }
  .lv-arc { stroke-dasharray: 240; animation: lvArcDraw 1s ease-out forwards; }

  @keyframes lvArcPulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 1; }
  }
  .lv-arc-pulse { animation: lvArcPulse 2.2s ease-in-out infinite; }

  @keyframes lvSpotlight {
    0%, 14% { transform: translateX(0); }
    20%, 34% { transform: translateX(70px); }
    40%, 54% { transform: translateX(140px); }
    60%, 74% { transform: translateX(210px); }
    80%, 94% { transform: translateX(280px); }
    100% { transform: translateX(0); }
  }

  @keyframes lvWordDim {
    0%, 14% { opacity: 1; }
    20%, 100% { opacity: 0.35; }
  }

  /* Hand-rolled reduced-motion gate: Tailwind's motion-safe: variant only
     covers utilities Tailwind itself generates, not custom class names
     defined in this inline <style> block, so these are gated directly. */
  @media (prefers-reduced-motion: no-preference) {
    .lv-spotlight { animation: lvSpotlight 6s ease-in-out infinite; }
    .lv-word-0 { animation: lvWordDim 6s ease-in-out infinite; animation-delay: -6s; }
    .lv-word-1 { animation: lvWordDim 6s ease-in-out infinite; animation-delay: -4.8s; }
    .lv-word-2 { animation: lvWordDim 6s ease-in-out infinite; animation-delay: -3.6s; }
    .lv-word-3 { animation: lvWordDim 6s ease-in-out infinite; animation-delay: -2.4s; }
    .lv-word-4 { animation: lvWordDim 6s ease-in-out infinite; animation-delay: -1.2s; }
  }

  @keyframes lvPop {
    0% { transform: scale(0.85); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }
  .lv-pop { animation: lvPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
`;

function VisualCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="w-full rounded-2xl p-5 sm:p-6"
      style={{ background: LV.bg, border: `1px solid ${LV.border}` }}
    >
      <style>{visualStyles}</style>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------
// 1. Nested layers — click a ring, see what it actually means in practice
// ---------------------------------------------------------------------

type LayerKey = "ai" | "ml" | "dl" | "llm";

const LAYERS: { key: LayerKey; label: string; color: string; radius: number; caption: string; examples: string[] }[] = [
  { key: "ai", label: "AI", color: LV.violet, radius: 125, caption: "Any system doing a human-like task", examples: ["Your GPS estimating traffic", "Netflix recommending a show", "A spam filter sorting your inbox"] },
  { key: "ml", label: "Machine Learning", color: LV.blue, radius: 93, caption: "Learns patterns from examples, not hand-written rules", examples: ["A bank's fraud detector flagging a stolen card", "A house-price estimator", "Your photo app tagging faces"] },
  { key: "dl", label: "Deep Learning", color: LV.green, radius: 61, caption: "Many connected layers — good at messy, huge data", examples: ["Voice assistants understanding speech", "Face unlock on your phone", "A self-driving car reading road signs"] },
  { key: "llm", label: "LLMs", color: LV.coral, radius: 30, caption: "Deep learning trained on huge amounts of text", examples: ["ChatGPT drafting an email", "Claude summarizing a contract", "Copilot suggesting a line of code"] },
];

export function NestedLayersDiagram() {
  const [selected, setSelected] = useState<LayerKey>("ai");
  const active = LAYERS.find((l) => l.key === selected)!;

  return (
    <VisualCard>
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <svg viewBox="0 0 300 300" className="w-full max-w-[260px] flex-none" role="img" aria-label="Nested circles: AI containing Machine Learning, containing Deep Learning, containing LLMs">
          {LAYERS.map((layer, i) => {
            const isActive = layer.key === selected;
            return (
              <circle
                key={layer.key}
                className="lv-circle cursor-pointer"
                style={{ animationDelay: `${i * 0.12}s` }}
                cx="150"
                cy="150"
                r={layer.radius}
                fill={layer.key === "llm" ? layer.color : "none"}
                fillOpacity={layer.key === "llm" ? 0.25 : 1}
                stroke={layer.color}
                strokeWidth={isActive ? 4 : 2}
                opacity={isActive ? 1 : 0.55}
                onClick={() => setSelected(layer.key)}
              />
            );
          })}
        </svg>

        <div className="flex-1 w-full">
          <div className="flex flex-wrap gap-2 mb-4">
            {LAYERS.map((layer) => (
              <button
                key={layer.key}
                onClick={() => setSelected(layer.key)}
                className="rounded-full px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-all"
                style={{
                  background: selected === layer.key ? layer.color : "transparent",
                  color: selected === layer.key ? LV.bg : LV.inkOnNavy,
                  border: `1.5px solid ${layer.color}`,
                }}
              >
                <span className="w-2 h-2 rounded-full flex-none" style={{ background: selected === layer.key ? LV.bg : layer.color }} />
                {layer.label}
              </button>
            ))}
          </div>

          <div key={selected} className="lv-pop">
            <p className="text-sm font-semibold mb-2" style={{ color: active.color }}>
              {active.caption}
            </p>
            <ul className="flex flex-col gap-1.5">
              {active.examples.map((ex) => (
                <li key={ex} className="text-sm flex items-start gap-2" style={{ color: LV.inkOnNavySoft }}>
                  <span aria-hidden style={{ color: active.color }}>
                    ●
                  </span>
                  {ex}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <p className="font-mono text-[10.5px] mt-4" style={{ color: LV.inkOnNavySoft }}>
        Tap a ring to see what actually lives there.
      </p>
    </VisualCard>
  );
}

// ---------------------------------------------------------------------
// 2. Attention sentence demo — same word, different meaning, financial vs. river
// ---------------------------------------------------------------------

type SentenceConfig = {
  emoji: string;
  words: string[];
  focus: number;
  connections: number[];
  meaning: string;
};

const SENTENCES: Record<"financial" | "river", SentenceConfig> = {
  financial: {
    emoji: "🏦",
    words: ["The", "bank", "raised", "interest", "rates"],
    focus: 1,
    connections: [2, 3, 4],
    meaning: "Financial institution",
  },
  river: {
    emoji: "🌊",
    words: ["We", "sat", "by", "the", "river", "bank"],
    focus: 5,
    connections: [1, 4],
    meaning: "Land beside water",
  },
};

function SentenceArcs({ config }: { config: SentenceConfig }) {
  const spacing = 78;
  const chipW = 64;
  const chipH = 34;
  const y = 92;
  const width = config.words.length * spacing + 20;

  return (
    <svg viewBox={`0 0 ${width} 150`} className="w-full h-auto" role="img" aria-label={`Sentence: ${config.words.join(" ")}`}>
      {config.connections.map((targetIdx, i) => {
        const x1 = 20 + config.focus * spacing + chipW / 2;
        const x2 = 20 + targetIdx * spacing + chipW / 2;
        const dist = Math.abs(targetIdx - config.focus);
        const arcHeight = 24 + dist * 16;
        const midX = (x1 + x2) / 2;
        const controlY = y - arcHeight;
        return (
          <path
            key={targetIdx}
            className="lv-arc"
            style={{ animationDelay: `${i * 0.15}s` }}
            d={`M ${x1} ${y} Q ${midX} ${controlY} ${x2} ${y}`}
            fill="none"
            stroke={LV.blue}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        );
      })}

      {config.words.map((word, i) => {
        const isFocus = i === config.focus;
        const isConnected = config.connections.includes(i);
        const x = 20 + i * spacing;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={chipW}
              height={chipH}
              rx="8"
              fill={isFocus ? LV.coral : isConnected ? LV.blue : LV.surface}
              fillOpacity={isFocus || isConnected ? 1 : 1}
            />
            <text
              x={x + chipW / 2}
              y={y + chipH / 2 + 5}
              textAnchor="middle"
              fontSize="13"
              fontWeight={isFocus || isConnected ? "bold" : "normal"}
              fill={isFocus || isConnected ? LV.surface : LV.ink}
            >
              {word}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function AttentionSentenceDemo() {
  const [mode, setMode] = useState<"financial" | "river">("financial");
  const config = SENTENCES[mode];

  return (
    <VisualCard>
      <div className="flex gap-2 mb-4">
        {(["financial", "river"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className="rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all"
            style={{
              background: mode === m ? LV.violet : "transparent",
              color: mode === m ? LV.bg : LV.inkOnNavy,
              border: `1.5px solid ${LV.violet}`,
            }}
          >
            {SENTENCES[m].emoji} {m === "financial" ? "Financial" : "River"}
          </button>
        ))}
      </div>

      <div key={mode} className="lv-pop">
        <SentenceArcs config={config} />
        <p className="text-sm mt-2" style={{ color: LV.inkOnNavy }}>
          &ldquo;{config.words[config.focus]}&rdquo; here means:{" "}
          <span className="font-semibold" style={{ color: LV.coral }}>
            {config.meaning}
          </span>
        </p>
      </div>
      <p className="font-mono text-[10.5px] mt-3" style={{ color: LV.inkOnNavySoft }}>
        Same word, different meaning — the model looks at nearby words to tell them apart.
      </p>
    </VisualCard>
  );
}

// ---------------------------------------------------------------------
// 3. Split-screen: old word-by-word tunnel vs. new full-sentence view
// ---------------------------------------------------------------------

const COMPARE_WORDS = ["The", "model", "reads", "every", "word"];

export function TransformerCompareDiagram() {
  return (
    <VisualCard>
      <div className="grid sm:grid-cols-2 gap-4">
        {/* OLD: narrow tunnel, one word lit at a time */}
        <div className="rounded-xl p-4" style={{ background: LV.bgRaised }}>
          <p className="font-mono text-[10.5px] uppercase tracking-widest mb-3" style={{ color: LV.inkOnNavySoft }}>
            Old: word-by-word
          </p>
          <div className="relative h-16 rounded-lg overflow-hidden flex items-center px-3" style={{ background: LV.bg, border: `1px solid ${LV.border}` }}>
            {COMPARE_WORDS.map((word, i) => (
              <span
                key={word}
                className={`lv-word-${i} absolute font-semibold text-sm`}
                style={{ left: `${12 + i * 56}px`, color: LV.surface, opacity: i === 0 ? 1 : 0.35 }}
              >
                {word}
              </span>
            ))}
            <div
              className="lv-spotlight absolute left-2 top-2 bottom-2 w-14 rounded-md pointer-events-none"
              style={{ border: `2px solid ${LV.coral}`, boxShadow: `0 0 12px ${LV.coral}` }}
            />
          </div>
          <p className="text-xs mt-2" style={{ color: LV.inkOnNavySoft }}>
            Sees one word at a time. Forgets what came before.
          </p>
        </div>

        {/* NEW: full sentence, connections pulsing */}
        <div className="rounded-xl p-4" style={{ background: LV.bgRaised }}>
          <p className="font-mono text-[10.5px] uppercase tracking-widest mb-3" style={{ color: LV.green }}>
            New: Transformer
          </p>
          <div className="relative h-16 rounded-lg flex items-center px-3 gap-2" style={{ background: LV.bg, border: `1px solid ${LV.border}` }}>
            {COMPARE_WORDS.map((word) => (
              <span key={word} className="font-semibold text-xs px-2 py-1 rounded" style={{ background: LV.green, color: LV.bg }}>
                {word}
              </span>
            ))}
          </div>
          <p className="text-xs mt-2 lv-arc-pulse" style={{ color: LV.green }}>
            Sees the whole sentence at once, every time.
          </p>
        </div>
      </div>
    </VisualCard>
  );
}

// ---------------------------------------------------------------------
// 4. Confidence looks the same either way — reveal which answer was real
// ---------------------------------------------------------------------

export function ConfidenceComparisonDiagram() {
  const [revealed, setRevealed] = useState(false);

  return (
    <VisualCard>
      <p className="text-sm mb-4" style={{ color: LV.inkOnNavy }}>
        Question: <span className="font-semibold">&ldquo;When was the Eiffel Tower built?&rdquo;</span>
      </p>

      <div className="grid sm:grid-cols-2 gap-3">
        {[
          { answer: "1889", correct: true },
          { answer: "1847", correct: false },
        ].map((item) => (
          <div
            key={item.answer}
            className="rounded-xl p-4 transition-colors"
            style={{
              background: LV.bgRaised,
              border: `1.5px solid ${revealed ? (item.correct ? LV.green : LV.coral) : LV.border}`,
            }}
          >
            <p className="text-xl font-bold" style={{ color: LV.surface }}>
              {item.answer}
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{
              background: !revealed ? LV.violetSoft : item.correct ? LV.greenSoft : LV.coralSoft,
              color: !revealed ? LV.violet : item.correct ? LV.green : LV.coral,
            }}>
              {!revealed ? "● Sounds confident" : item.correct ? "✓ Verified" : "✕ Invented"}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setRevealed((v) => !v)}
        className="mt-4 rounded-full px-4 py-2 text-xs font-semibold transition-all"
        style={{ background: LV.coral, color: LV.bg }}
      >
        {revealed ? "Hide the check" : "Check the sources"}
      </button>

      <p className="font-mono text-[10.5px] mt-3" style={{ color: LV.inkOnNavySoft }}>
        {revealed
          ? "Same confident tone, one real answer. Only checking told them apart."
          : "Both look equally sure. Confidence alone can't tell you which one is right."}
      </p>
    </VisualCard>
  );
}
