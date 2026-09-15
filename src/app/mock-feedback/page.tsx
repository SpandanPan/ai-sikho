"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type Submission = {
  id: string;
  category: string;
  question: string;
  status: "PENDING" | "PAID" | "GRADED" | "FAILED";
  isFree: boolean;
  provider: string | null;
  createdAt: string;
  feedbackJson: { score: number; strengths: string[]; gaps: string[]; suggestion: string } | null;
  errorMessage: string | null;
};

const MODEL_LABEL: Record<string, string> = {
  ollama: "Gemma 4 (self-hosted, free tier)",
  anthropic: "Claude Sonnet 5 (paid tier)",
  openai: "GPT (paid tier)",
};

function usedFreeAttemptThisMonth(submissions: Submission[]): boolean {
  const now = new Date();
  return submissions.some(
    (s) =>
      s.isFree &&
      new Date(s.createdAt).getUTCFullYear() === now.getUTCFullYear() &&
      new Date(s.createdAt).getUTCMonth() === now.getUTCMonth()
  );
}

export default function MockFeedbackPage() {
  const { status } = useSession();
  const [category, setCategory] = useState("system-design");
  const [question, setQuestion] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [gradingFree, setGradingFree] = useState(false);

  function refresh() {
    fetch("/api/mock-feedback").then((r) => (r.ok ? r.json() : { submissions: [] })).then((d) => setSubmissions(d.submissions ?? []));
  }

  useEffect(() => {
    if (status === "authenticated") refresh();
  }, [status]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const res = await fetch("/api/mock-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, question, answerText }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error ?? "Couldn't submit.");
      return;
    }
    setMessage(
      "Submitted — held as pending until payment is wired up (see README). Once paid, grading runs automatically within seconds."
    );
    setQuestion("");
    setAnswerText("");
    refresh();
  }

  async function submitFree(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setGradingFree(true);
    const res = await fetch("/api/mock-feedback/free", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, question, answerText }),
    });
    const data = await res.json();
    setGradingFree(false);
    if (!res.ok) {
      setMessage(data.error ?? "Couldn't grade that for free.");
      return;
    }
    setMessage("Graded — see it below.");
    setQuestion("");
    setAnswerText("");
    refresh();
  }

  const freeUsed = usedFreeAttemptThisMonth(submissions);

  if (status === "loading") return null;
  if (status !== "authenticated") {
    return (
      <main className="mx-auto max-w-lg px-5 py-16">
        <a href="/signin?callbackUrl=/mock-feedback" className="text-sm text-accent-ink underline">Sign in →</a>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-5 py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-2">Free tier available · Paid · ₹149</p>
      <h1 className="font-display text-2xl font-semibold mb-1">Get real feedback on a mock answer.</h1>
      <p className="text-ink-soft mb-4 max-w-xl">
        Write your answer to a real interview question. An AI grader scores it, names what's
        actually strong, what's missing, and the one thing to fix first — specific to what you
        wrote, not a generic rubric.
      </p>
      <div className="border border-accent rounded p-4 mb-8 max-w-xl">
        <p className="font-mono text-[10.5px] uppercase text-accent2 mb-1.5">Unlike most AI interview tools</p>
        <p className="text-sm text-ink-soft">
          We tell you which model actually graded you, and why. Your <b>free</b> attempt runs on a
          self-hosted open model — genuinely useful, genuinely free, no catch. The <b>₹149</b> option
          runs on Claude Sonnet 5, a frontier model, for a sharper, more reliable grade — that
          difference is the entire reason it costs anything. See the exact numbers in{" "}
          <a href="https://github.com/SpandanPan/the-model-desk/blob/main/AGENT_COSTS.md" target="_blank" rel="noreferrer" className="text-accent-ink underline">
            AGENT_COSTS.md
          </a>.
        </p>
      </div>

      <form onSubmit={submit} className="border border-paper-line rounded p-5 flex flex-col gap-2.5 mb-10">
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border border-paper-line rounded px-3 py-2 text-sm bg-paper">
          <option value="system-design">System design</option>
          <option value="rag">RAG</option>
          <option value="agentic-ai">Agentic AI</option>
          <option value="behavioral">Behavioral</option>
        </select>
        <input
          placeholder="The question you're answering"
          required
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="border border-paper-line rounded px-3 py-2 text-sm bg-paper"
        />
        <textarea
          placeholder="Your answer"
          required
          rows={6}
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          className="border border-paper-line rounded px-3 py-2 text-sm bg-paper"
        />
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={submitFree}
            disabled={freeUsed || gradingFree}
            title={freeUsed ? "You've used this month's free grading" : "Graded by a self-hosted open model"}
            className="font-mono text-xs border border-paper-line rounded px-3.5 py-2 disabled:opacity-40"
          >
            {gradingFree ? "Grading…" : freeUsed ? "Free grading used this month" : "Grade it free (1/month)"}
          </button>
          <button type="submit" className="font-mono text-xs bg-ink text-paper rounded px-3.5 py-2">
            Submit for feedback — ₹149 (Claude Sonnet 5)
          </button>
        </div>
      </form>

      {message && <p className="text-sm text-accent-ink mb-8">{message}</p>}

      <h2 className="font-semibold text-sm mb-3">Your submissions</h2>
      <div className="flex flex-col gap-3">
        {submissions.map((s) => (
          <div key={s.id} className="border border-paper-line rounded p-4">
            <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
              <span className="font-mono text-[10.5px] uppercase text-ink-soft">{s.category} · {s.status}</span>
              {s.provider && (
                <span className="font-mono text-[10.5px] text-accent2">{MODEL_LABEL[s.provider] ?? s.provider}</span>
              )}
            </div>
            <p className="text-sm font-semibold mb-2">{s.question}</p>
            {s.status === "GRADED" && s.feedbackJson && (
              <div className="text-sm space-y-2">
                <p><b>Score:</b> {s.feedbackJson.score}/10</p>
                <p><b>Strengths:</b> {s.feedbackJson.strengths.join("; ")}</p>
                <p><b>Gaps:</b> {s.feedbackJson.gaps.join("; ")}</p>
                <p><b>Fix first:</b> {s.feedbackJson.suggestion}</p>
              </div>
            )}
            {s.status === "PENDING" && <p className="text-xs text-ink-soft">Waiting on payment.</p>}
            {s.status === "FAILED" && <p className="text-xs text-rust">Grading failed: {s.errorMessage}</p>}
          </div>
        ))}
        {submissions.length === 0 && <p className="text-sm text-ink-soft">No submissions yet.</p>}
      </div>
    </main>
  );
}
