// One small CSS-only animation per lesson section, each visualizing the
// specific idea that section teaches rather than acting as decoration.
// Same motion-safe: pattern as TrackIcon.tsx — prefers-reduced-motion:reduce
// freezes every one of these to a static, still-legible frame automatically.

export type LessonAnimationKind =
  | "landscape"
  | "databoom"
  | "attention"
  | "predict"
  | "draft"
  | "confidence"
  | "memory"
  | "vocab"
  | "nextstep"
  | "steps";

const VOCAB_TERMS = ["Prompt", "Token", "Context window", "Hallucination", "Model"];

const LANDSCAPE_LAYERS = [
  { label: "AI", sub: "any task that looks like it needs human smarts" },
  { label: "Machine learning", sub: "learns patterns from data instead of hand-coded rules" },
  { label: "Deep learning", sub: "layered neural networks — LLMs live here" },
  { label: "LLMs", sub: "ChatGPT, Claude, Gemini…" },
];

export default function LessonAnimation({ kind }: { kind: LessonAnimationKind }) {
  return (
    <div className="w-full min-h-20 border border-paper-line rounded bg-paper-line/10 flex items-center justify-center px-3 py-2">
      {kind === "landscape" && (
        <div className="flex items-center gap-1.5">
          {LANDSCAPE_LAYERS.map((layer, i) => (
            <div
              key={layer.label}
              className="motion-safe:animate-layer-reveal border border-accent2/50 rounded px-2 py-1"
              style={{ animationDelay: `${i * 0.5}s` }}
              title={layer.sub}
            >
              <span className="font-mono text-[9.5px] text-accent-ink whitespace-nowrap">{layer.label}</span>
            </div>
          ))}
        </div>
      )}

      {kind === "databoom" && (
        <div className="flex items-end gap-2 h-14">
          {[
            { label: "'90s", h: "h-3" },
            { label: "'00s", h: "h-6" },
            { label: "'10s", h: "h-10" },
            { label: "'20s", h: "h-14" },
          ].map((bar, i) => (
            <div key={bar.label} className="flex flex-col items-center gap-1">
              <div
                className={`motion-safe:animate-bar-grow w-3 ${bar.h} bg-accent2/70 rounded-t`}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
              <span className="font-mono text-[9px] text-ink-soft">{bar.label}</span>
            </div>
          ))}
        </div>
      )}

      {kind === "attention" && (
        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          {["The", "bank", "raised", "rates"].map((word, i) => (
            <span
              key={word}
              className={`motion-safe:animate-token-pop px-1.5 py-1 rounded border ${
                i === 1 || i === 3 ? "border-accent-ink text-accent-ink" : "border-paper-line text-ink-soft"
              }`}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {word}
            </span>
          ))}
        </div>
      )}

      {kind === "predict" && (
        <p className="font-mono text-xs text-ink-soft text-center leading-relaxed">
          The capital of France is{" "}
          <span className="motion-safe:animate-token-pop inline-block font-semibold text-accent-ink">
            Paris
          </span>
          .
        </p>
      )}

      {kind === "draft" && (
        <div className="flex flex-col items-center gap-1 w-full text-center">
          <p className="font-mono text-[10px] text-ink-soft leading-snug">
            &ldquo;q3 numbers up, need update 2 team by fri&rdquo;
          </p>
          <span className="text-ink-soft text-xs" aria-hidden>
            ↓
          </span>
          <p className="motion-safe:animate-layer-reveal font-mono text-[10px] font-semibold text-accent-ink leading-snug">
            &ldquo;Hi team — Q3 numbers are up. Update by Friday.&rdquo;
          </p>
        </div>
      )}

      {kind === "confidence" && (
        <div className="flex items-center gap-3">
          <div className="motion-safe:animate-confidence-glow rounded-full bg-rust/15 border border-rust/50 px-3 py-1.5">
            <span className="font-mono text-[11px] text-rust">&ldquo;Definitely 1847.&rdquo;</span>
          </div>
          <span className="motion-safe:animate-flag-blink text-lg" aria-hidden>
            ✗
          </span>
        </div>
      )}

      {kind === "memory" && (
        <div className="flex items-center gap-4 font-mono text-[10.5px] text-ink-soft">
          <div className="flex flex-col items-center gap-1">
            <span>same chat</span>
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-accent2" />
              <span className="w-2 h-2 rounded-full bg-accent2" />
              <span className="w-2 h-2 rounded-full bg-accent2" />
            </div>
          </div>
          <span aria-hidden>→</span>
          <div className="flex flex-col items-center gap-1">
            <span>new chat</span>
            <div className="motion-safe:animate-bubble-clear flex gap-1">
              <span className="w-2 h-2 rounded-full bg-paper-line" />
              <span className="w-2 h-2 rounded-full bg-paper-line" />
              <span className="w-2 h-2 rounded-full bg-paper-line" />
            </div>
          </div>
        </div>
      )}

      {kind === "vocab" && (
        <div className="relative w-full max-w-[180px] h-6">
          {VOCAB_TERMS.map((term, i) => (
            <span
              key={term}
              className="motion-safe:animate-term-cycle absolute inset-0 flex items-center justify-center font-mono text-xs font-semibold text-accent-ink"
              style={{ animationDelay: `${-i * 2}s` }}
            >
              {term}
            </span>
          ))}
        </div>
      )}

      {kind === "nextstep" && (
        <div className="flex flex-col gap-1.5 w-full">
          {["Check facts", "Know its limits", "Try it today"].map((label, i) => (
            <div key={label} className="flex items-center gap-1.5">
              <span
                className="motion-safe:animate-check-tick w-4 h-4 flex-none rounded-full bg-accent2 text-paper text-[10px] flex items-center justify-center"
                style={{ animationDelay: `${i * 0.4}s` }}
                aria-hidden
              >
                ✓
              </span>
              <span className="font-mono text-[9.5px] text-ink-soft">{label}</span>
            </div>
          ))}
        </div>
      )}

      {kind === "steps" && (
        <div className="flex flex-col gap-1.5 w-full">
          {["Install", "Set up", "Use it"].map((label, i) => (
            <div key={label} className="flex items-center gap-1.5">
              <span
                className="motion-safe:animate-check-tick w-4 h-4 flex-none rounded-full bg-accent-ink text-paper text-[10px] flex items-center justify-center"
                style={{ animationDelay: `${i * 0.4}s` }}
                aria-hidden
              >
                {i + 1}
              </span>
              <span className="font-mono text-[9.5px] text-ink-soft">{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
