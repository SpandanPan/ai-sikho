"use client";

import { useState } from "react";
import { SUPPORTED_INDIC_LANGUAGES, type IndicLanguage } from "@/lib/translate";

const SAMPLE = "AI can help you write better emails, faster.";
const SAMPLE_QUESTION = "What is machine learning, in simple terms?";

type Mode = "translate" | "chat";

export default function IndicLanguageSection() {
  const [mode, setMode] = useState<Mode>("translate");
  const [text, setText] = useState(SAMPLE);
  const [question, setQuestion] = useState(SAMPLE_QUESTION);
  const [language, setLanguage] = useState<IndicLanguage>("Telugu");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function switchMode(next: Mode) {
    setMode(next);
    setResult(null);
    setError(null);
  }

  async function run() {
    const input = mode === "translate" ? text : question;
    setLoading(true);
    setError(null);
    setResult(null);
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input, targetLanguage: language, mode }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Couldn't do that.");
      return;
    }
    setResult(data.result);
  }

  return (
    <section className="border-b border-paper-line py-9">
      <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-1">Live demo</p>
      <h2 className="font-display text-xl font-semibold mb-2">AI in your own language.</h2>
      <p className="text-sm text-ink-soft mb-5 max-w-lg">
        AI isn&apos;t only for English — translate a line, or ask a real question and get a real
        answer, in Hindi, Telugu, Bengali, Marathi, and more.
      </p>

      <div className="border border-paper-line rounded p-4">
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => switchMode("translate")}
            className={`font-mono text-xs rounded px-2.5 py-1.5 border transition-colors ${
              mode === "translate" ? "bg-ink text-paper border-ink" : "border-paper-line text-ink-soft hover:border-accent"
            }`}
          >
            Translate a line
          </button>
          <button
            onClick={() => switchMode("chat")}
            className={`font-mono text-xs rounded px-2.5 py-1.5 border transition-colors ${
              mode === "chat" ? "bg-ink text-paper border-ink" : "border-paper-line text-ink-soft hover:border-accent"
            }`}
          >
            Ask a question
          </button>
        </div>

        {mode === "translate" ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 300))}
            rows={2}
            placeholder="Type a line to translate…"
            className="w-full border border-paper-line rounded px-3 py-2 text-sm bg-paper mb-3"
          />
        ) : (
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value.slice(0, 300))}
            rows={2}
            placeholder="Ask anything — e.g. What is a neural network?"
            className="w-full border border-paper-line rounded px-3 py-2 text-sm bg-paper mb-3"
          />
        )}

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
          onClick={run}
          disabled={loading || !(mode === "translate" ? text : question).trim()}
          className="font-mono text-xs bg-ink text-paper rounded px-3.5 py-2 disabled:opacity-50"
        >
          {loading
            ? mode === "translate"
              ? "Translating…"
              : "Thinking…"
            : mode === "translate"
            ? `Translate to ${language} →`
            : `Ask in ${language} →`}
        </button>
        {error && <p className="text-xs text-rust mt-3">{error}</p>}
        {result && <p className="text-base mt-4 border-l-2 border-accent pl-3 py-1">{result}</p>}
      </div>
    </section>
  );
}
