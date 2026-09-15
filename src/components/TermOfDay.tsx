"use client";

import { useEffect, useState } from "react";

type Term = { term: string; definition: string; source: string };

// Small and quiet on purpose — this is a daily nugget, not a showpiece
// section. Fetches /api/term-of-day, which itself falls back to a
// hand-written evergreen set if the daily cron hasn't generated one yet.
export default function TermOfDay() {
  const [data, setData] = useState<Term | null>(null);

  useEffect(() => {
    fetch("/api/term-of-day").then((r) => (r.ok ? r.json() : null)).then(setData).catch(() => {});
  }, []);

  if (!data) return null;

  return (
    <div className="border border-paper-line rounded p-4 flex items-start gap-3">
      <span className="font-mono text-[10.5px] uppercase tracking-widest text-accent2 flex-none mt-0.5">
        Term of the day
      </span>
      <p className="text-sm">
        <b>{data.term}</b> — <span className="text-ink-soft">{data.definition}</span>
      </p>
    </div>
  );
}
