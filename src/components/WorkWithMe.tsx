"use client";

import { useState } from "react";
import { automationServices } from "@/data/automationServices";
import { workExamples } from "@/data/workExamples";
import { trackClick } from "@/lib/trackEvent";

export default function WorkWithMe() {
  const [selected, setSelected] = useState<string | null>(null);
  const [otherText, setOtherText] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  function selectService(slug: string) {
    setSelected(slug);
    trackClick(`work-with-me-service-${slug}`);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setStatus("sending");
    setError(null);

    const service = selected === "other" ? (otherText.trim() || "other") : selected;
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ service, ...form }),
    });

    if (!res.ok) {
      setError((await res.json()).error ?? "Couldn't send that — try again.");
      setStatus("error");
      return;
    }
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="border border-accent rounded p-6 text-center">
        <p className="font-semibold mb-1">Got it — thanks.</p>
        <p className="text-sm text-ink-soft">We&apos;ll reach out at the contact info you gave us.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-2 font-semibold">Running a business?</p>
      <h2 className="font-display text-2xl font-semibold mb-1 text-balance">Bring me the busywork.</h2>
      <p className="text-sm text-ink-soft mb-6 max-w-lg">
        Have a repetitive process you&apos;d like to automate? Tell me what it is. I&apos;ll help you figure out
        whether AI can actually solve it — no hype, no jargon.
      </p>

      <div className="mb-7">
        <p className="font-mono text-[10.5px] uppercase tracking-widest text-ink-soft mb-3">
          What this can look like — illustrative examples, not real client work
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {workExamples.map((ex) => (
            <div key={ex.problem} className="border border-paper-line rounded-lg p-3.5 bg-paper">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-base" aria-hidden>
                  {ex.icon}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-accent2">{ex.category}</span>
              </div>
              <p className="text-xs text-ink-soft mb-2 leading-relaxed">{ex.problem}</p>
              <p className="text-xs text-ink leading-relaxed">
                <span className="text-accent-ink font-semibold">→ </span>
                {ex.fix}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 mb-6">
        {automationServices.map((s) => (
          <button
            key={s.slug}
            type="button"
            onClick={() => selectService(s.slug)}
            className={`text-left border rounded-lg p-4 transition-all ${
              selected === s.slug ? "border-accent bg-paper-raised shadow-sm" : "border-paper-line hover:border-accent hover:-translate-y-0.5"
            }`}
          >
            <span className="text-xl mb-1.5 block" aria-hidden>
              {s.icon}
            </span>
            <h3 className="font-semibold text-sm mb-1">{s.title}</h3>
            <p className="text-xs text-ink-soft">{s.description}</p>
          </button>
        ))}
      </div>

      {selected && (
        <form onSubmit={submit} className="border border-paper-line rounded p-5 flex flex-col gap-2.5">
          <p className="font-mono text-[10.5px] uppercase text-accent2 mb-1">
            Get a quote — {automationServices.find((s) => s.slug === selected)?.title}
          </p>
          {selected === "other" && (
            <input
              placeholder="What do you need automated?"
              required
              value={otherText}
              onChange={(e) => setOtherText(e.target.value)}
              className="border border-paper-line rounded px-3 py-2 text-sm bg-paper"
            />
          )}
          <input
            placeholder="Your name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border border-paper-line rounded px-3 py-2 text-sm bg-paper"
          />
          <div className="grid sm:grid-cols-2 gap-2.5">
            <input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="border border-paper-line rounded px-3 py-2 text-sm bg-paper"
            />
            <input
              placeholder="Mobile number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="border border-paper-line rounded px-3 py-2 text-sm bg-paper"
            />
          </div>
          <textarea
            placeholder="Anything else we should know? (optional)"
            rows={3}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="border border-paper-line rounded px-3 py-2 text-sm bg-paper"
          />
          {error && <p className="text-xs text-rust">{error}</p>}
          <button
            type="submit"
            disabled={status === "sending" || (!form.email.trim() && !form.phone.trim())}
            className="font-mono text-sm bg-ink text-paper rounded px-4 py-2.5 self-start disabled:opacity-50"
          >
            {status === "sending" ? "Sending…" : "Get a quote →"}
          </button>
          {!form.email.trim() && !form.phone.trim() && (
            <p className="text-[11px] text-ink-soft">Give us an email or phone number to reach you at.</p>
          )}
        </form>
      )}
    </div>
  );
}
