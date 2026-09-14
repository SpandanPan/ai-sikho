"use client";

import { useState } from "react";
import { trackClick } from "@/lib/trackEvent";

export default function NewsletterSignup({ source = "homepage" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source }),
    });
    if (!res.ok) {
      setError((await res.json()).error ?? "Couldn't sign you up — try again.");
      setStatus("error");
      return;
    }
    trackClick("newsletter-signup");
    setStatus("sent");
  }

  if (status === "sent") {
    return <p className="text-sm text-accent2">You&apos;re on the list — we&apos;ll only email when there&apos;s something worth reading.</p>;
  }

  return (
    <div className="max-w-md">
      <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2.5">
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 border border-paper-line rounded px-3.5 py-2.5 text-sm bg-paper"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="font-mono text-sm bg-ink text-paper rounded px-4 py-2.5 whitespace-nowrap disabled:opacity-50"
        >
          {status === "sending" ? "Signing up…" : "Get the free digest →"}
        </button>
      </form>
      {error && <p className="text-xs text-rust mt-2">{error}</p>}
    </div>
  );
}
