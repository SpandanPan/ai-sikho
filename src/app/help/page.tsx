"use client";

import { useState } from "react";

export default function HelpPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    const res = await fetch("/api/help", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      setError((await res.json()).error ?? "Couldn't send that — try again.");
      setStatus("error");
      return;
    }
    setStatus("sent");
  }

  return (
    <main className="mx-auto max-w-lg px-5 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-2">Help</p>
      <h1 className="font-display text-2xl font-semibold mb-2">Need something? Ask here.</h1>
      <p className="text-ink-soft mb-8">
        A payment issue, a bug, a question about a course or the Interview Pack — write it below
        and we'll reply to your email directly.
      </p>

      {status === "sent" ? (
        <p className="text-sm text-accent2 border border-accent rounded p-4">
          Got it — we&apos;ll reply to {form.email} soon.
        </p>
      ) : (
        <form onSubmit={submit} className="border border-paper-line rounded p-5 flex flex-col gap-2.5">
          <input
            placeholder="Your name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border border-paper-line rounded px-3 py-2 text-sm bg-paper"
          />
          <input
            type="email"
            placeholder="you@example.com"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border border-paper-line rounded px-3 py-2 text-sm bg-paper"
          />
          <textarea
            placeholder="What's going on?"
            required
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="border border-paper-line rounded px-3 py-2 text-sm bg-paper"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="font-mono text-xs bg-ink text-paper rounded px-3.5 py-2 self-start disabled:opacity-50"
          >
            {status === "sending" ? "Sending…" : "Send →"}
          </button>
          {error && <p className="text-xs text-rust">{error}</p>}
        </form>
      )}
    </main>
  );
}
