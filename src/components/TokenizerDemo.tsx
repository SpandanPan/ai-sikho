"use client";

import { useMemo, useState } from "react";
import { encode, decode } from "gpt-tokenizer";

const MAX_CHARS = 400;
const SWATCHES = ["bg-accent2/25", "bg-accent/25", "bg-spark/40", "bg-rust/20"];

// Real tokenization (cl100k_base, the GPT-4-family encoding via the
// gpt-tokenizer package), not an approximation — the actual thing people
// ask about when they wonder "why does AI pricing count in tokens, not
// words or characters."
export default function TokenizerDemo() {
  const [text, setText] = useState("Tokens aren't words — they're pieces a model reads and pays for.");

  const tokens = useMemo(() => {
    const trimmed = text.slice(0, MAX_CHARS);
    return encode(trimmed).map((id) => decode([id]));
  }, [text]);

  return (
    <div className="border border-paper-line rounded p-4">
      <p className="font-mono text-[10.5px] uppercase tracking-widest text-accent2 mb-1">Live demo</p>
      <h3 className="font-semibold text-sm mb-2">How a tokenizer sees your text</h3>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
        rows={2}
        className="w-full border border-paper-line rounded px-3 py-2 text-sm bg-paper mb-3"
      />
      <div className="flex flex-wrap gap-1 mb-2 min-h-[2rem]">
        {tokens.map((t, i) => (
          <span
            key={i}
            className={`font-mono text-xs px-1.5 py-0.5 rounded ${SWATCHES[i % SWATCHES.length]}`}
            title={`Token ${i + 1}`}
          >
            {t.replace(/\n/g, "⏎").replace(/ /g, "·")}
          </span>
        ))}
      </div>
      <p className="text-xs text-ink-soft">
        <b className="text-ink">{tokens.length}</b> tokens for <b className="text-ink">{text.length}</b> characters —
        real GPT-4-family tokenization, running entirely in your browser (nothing sent anywhere).
        This is what API pricing is actually metered in, not words.
      </p>
    </div>
  );
}
