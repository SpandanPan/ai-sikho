"use client";

import { useState } from "react";
import { SUPPORTED_INDIC_LANGUAGES, type IndicLanguage } from "@/lib/translate";

const SAMPLE = "AI can help you write better emails, faster.";

// A different open model than the site's general default (gemma4:e4b) —
// translategemma, chosen specifically because it's built for this task.
// See src/lib/translate.ts and AGENT_COSTS.md for why "don't force one
// local model onto every job" matters here specifically.
export default function IndicLanguageSection() {
  const [text, setText] = useState(SAMPLE);
  const [language, setLanguage] = useState<IndicLanguage>("Telugu");
  const [translated, setTranslated] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function translate() {
    setLoading(true);
    setError(null);
    setTranslated(null);
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, targetLanguage: language }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Couldn't translate that.");
      return;
    }
    setTranslated(data.translated);
  }

  return (
    <section className="border-b border-paper-line py-9">
      <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-1">Live demo</p>
      <h2 className="font-display text-xl font-semibold mb-2">AI in your own language.</h2>
      <p className="text-sm text-ink-soft mb-5 max-w-lg">
        Open models aren&apos;t only for English — a translation-specialist open model, running
        locally, handling Hindi, Telugu, Bengali, Marathi, and more.
      </p>

      <div className="border border-paper-line rounded p-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 300))}
          rows={2}
          className="w-full border border-paper-line rounded px-3 py-2 text-sm bg-paper mb-3"
        />
        <div className="flex flex-wrap gap-2 mb-3">
          {SUPPORTED_INDIC_LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`font-mono text-xs rounded px-2.5 py-1 border transition-colors ${
                lang === language ? "bg-ink text-paper border-ink" : "border-paper-line text-ink-soft hover:border-accent"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
        <button
          onClick={translate}
          disabled={loading || !text.trim()}
          className="font-mono text-xs bg-ink text-paper rounded px-3.5 py-2 disabled:opacity-50"
        >
          {loading ? "Translating…" : `Translate to ${language} →`}
        </button>
        {error && <p className="text-xs text-rust mt-3">{error}</p>}
        {translated && (
          <p className="text-base mt-4 border-l-2 border-accent pl-3 py-1">{translated}</p>
        )}
      </div>
    </section>
  );
}
