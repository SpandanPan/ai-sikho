"use client";

import { useState } from "react";
import { rankDocs } from "@/lib/ragScore";

// A fixed, clearly-fake "knowledge base" — this is a teaching demo, not a
// real support system.
const DOCS = [
  { id: "refunds", text: "Refunds: all sales are final on every paid product (Interview Kit, Starter Pack, courses, mentoring, mock feedback) — see the real refund policy for the narrow exceptions." },
  { id: "access", text: "Course access: once purchased, a course is available permanently — no subscription, no expiry." },
  { id: "payments", text: "Payment methods: we accept UPI, cards, and net banking via Razorpay." },
  { id: "support", text: "Support: use the /help contact form — typical response time is under 24 hours on weekdays." },
  { id: "open-access", text: "Open content: the AI Pulse news feed and Model Costs page cost nothing to read, permanently." },
];

export default function RagDemo() {
  const [question, setQuestion] = useState("How do refunds work?");
  const [result, setResult] = useState<{ id: string; text: string; score: number }[] | null>(null);

  function ask() {
    setResult(rankDocs(question, DOCS));
  }

  const top = result?.filter((r) => r.score > 0).slice(0, 2) ?? [];

  return (
    <div className="border border-accent rounded bg-paper-raised p-5">
      <p className="font-mono text-[10.5px] uppercase tracking-wide text-accent-ink mb-3">Try it — retrieve, then generate</p>
      <div className="flex gap-2 flex-wrap mb-4">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="flex-1 min-w-[160px] text-sm border border-paper-line rounded px-3 py-2 bg-paper"
        />
        <button onClick={ask} className="font-mono text-xs bg-ink text-paper rounded px-3.5 py-2">
          Ask
        </button>
      </div>

      {result && (
        <div className="space-y-3">
          <div>
            <p className="font-mono text-[10.5px] uppercase text-ink-soft mb-1.5">1. Retrieved from the knowledge base</p>
            {result.map((r) => (
              <div key={r.id} className="flex items-center gap-2 text-xs py-1">
                <span className={`w-24 truncate ${r.score > 0 ? "text-ink" : "text-ink-soft"}`}>{r.id}</span>
                <span className="flex-1 h-1.5 bg-paper-line rounded overflow-hidden">
                  <span
                    className="block h-full bg-accent2"
                    style={{ width: `${Math.round(r.score * 100)}%` }}
                  />
                </span>
              </div>
            ))}
          </div>
          <div className="border-l-2 border-accent bg-paper rounded p-3 text-sm">
            <p className="font-mono text-[10.5px] uppercase text-ink-soft mb-1">2. Generated answer</p>
            {top.length ? (
              <p>{top.map((t) => t.text).join(" ")}</p>
            ) : (
              <p className="text-ink-soft">No relevant chunk found — this is what a well-built RAG system says instead of guessing.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
