"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

type Job = {
  id: string;
  type: "QUIZ" | "ARTICLE" | "ROADMAP";
  topic: string;
  provider: string | null;
  status: "PENDING" | "DONE" | "FAILED";
  resultJson: unknown;
  errorMessage: string | null;
  costInPaise: number | null;
  suggestedPriceInPaise: number | null;
};

function inr(paise: number | null) {
  return paise == null ? "—" : `₹${(paise / 100).toFixed(2)}`;
}

// Kicks off a draft only — nothing here publishes to the live site. Real
// API spend on a successful generation is auto-logged to the accounting
// ledger (category "ai_generation") — see /admin/reports.
export default function AdminGeneratePage() {
  const { status } = useSession();
  const [type, setType] = useState<Job["type"]>("QUIZ");
  const [provider, setProvider] = useState<"anthropic" | "openai">("anthropic");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState<Job | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setJob(null);
    const res = await fetch("/api/admin/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, topic, provider }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Generation failed.");
      setJob(data.job ?? null);
      setLoading(false);
      return;
    }
    setJob(data.job);
    setLoading(false);
  }

  if (status === "loading") return null;
  if (status !== "authenticated") {
    return (
      <main className="mx-auto max-w-lg px-5 py-16">
        <a href="/signin?callbackUrl=/admin/generate" className="text-sm text-accent-ink underline">Sign in →</a>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-5 py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-2">Admin</p>
      <h1 className="font-display text-2xl font-semibold mb-1">Content agents</h1>
      <p className="text-sm text-ink-soft mb-8">
        Drafts only — nothing here publishes automatically. Review the JSON below and copy what's
        good into the real content files by hand. Real API cost is logged to the accounting ledger
        automatically. See <code className="font-mono text-xs">COSTS.md</code> for pricing and how
        to get API keys.
      </p>

      <form onSubmit={generate} className="border border-paper-line rounded p-5 flex flex-col gap-2.5 mb-6">
        <select value={type} onChange={(e) => setType(e.target.value as Job["type"])} className="border border-paper-line rounded px-3 py-2 text-sm bg-paper">
          <option value="QUIZ">Quiz questions</option>
          <option value="ARTICLE">Article</option>
          <option value="ROADMAP">Roadmap phases</option>
        </select>
        <select value={provider} onChange={(e) => setProvider(e.target.value as "anthropic" | "openai")} className="border border-paper-line rounded px-3 py-2 text-sm bg-paper">
          <option value="anthropic">Claude (Anthropic)</option>
          <option value="openai">GPT (OpenAI)</option>
        </select>
        <input
          placeholder="Topic (e.g. 'vector database trade-offs')"
          required
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="border border-paper-line rounded px-3 py-2 text-sm bg-paper"
        />
        <button type="submit" disabled={loading} className="font-mono text-xs bg-ink text-paper rounded px-3.5 py-2 self-start disabled:opacity-50">
          {loading ? "Generating…" : "Generate draft"}
        </button>
      </form>

      {error && <p className="text-sm text-rust mb-4">{error}</p>}

      {job && (
        <div className="border border-paper-line rounded p-4">
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <p className="font-mono text-[10.5px] uppercase text-ink-soft">
              {job.status} · {job.provider} · {job.type} · {job.topic}
            </p>
            {job.status === "DONE" && (
              <p className="font-mono text-[10.5px] text-accent-ink">
                cost {inr(job.costInPaise)} · suggested price {inr(job.suggestedPriceInPaise)}
              </p>
            )}
          </div>
          <pre className="text-xs overflow-x-auto bg-paper-raised rounded p-3">
            {JSON.stringify(job.resultJson ?? job.errorMessage, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}
