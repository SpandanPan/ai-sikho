"use client";

import { useState } from "react";

// Keeps a section's permanently-visible copy short: the lesson body stays
// to ~2 paragraphs, and anything more detailed goes behind this toggle so
// curious readers can dig in without first-timers facing a wall of text.
export default function GoDeeper({ paragraphs, accent = "#6f5417" }: { paragraphs: string[]; accent?: string }) {
  const [open, setOpen] = useState(false);

  if (paragraphs.length === 0) return null;

  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen((v) => !v)}
        className="font-mono text-[11px] uppercase tracking-widest inline-flex items-center gap-1.5 hover:opacity-75 transition-opacity"
        style={{ color: accent }}
        aria-expanded={open}
      >
        <span className={`inline-block transition-transform ${open ? "rotate-90" : ""}`} aria-hidden>
          ▸
        </span>
        {open ? "Show less" : "Go deeper"}
      </button>
      {open && (
        <div className="mt-3 flex flex-col gap-3 border-l-2 pl-3" style={{ borderColor: accent }}>
          {paragraphs.map((p, i) => (
            <p key={i} className="text-sm text-ink-soft leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
