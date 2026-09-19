"use client";

// Quick-reference card for AI Fluency, closing out the lesson — redesigned
// as a 3-column "print this" style sheet: what it's great for, what to
// verify, and how to give it better instructions. Same navy/cream palette
// as the rest of the lesson's priority visuals.

import { LV } from "./lessonVisualTheme";

const COLUMNS = [
  {
    title: "Great for",
    icon: "✅",
    color: LV.green,
    items: [
      "First drafts and rewrites",
      "Summaries and outlines",
      "Brainstorming and options",
      "Translating and reformatting",
      "Explaining something differently",
    ],
  },
  {
    title: "Verify carefully",
    icon: "🔍",
    color: LV.coral,
    items: [
      "Precise facts, dates, statistics",
      "Citations and quotes",
      "Calculations",
      "Current events, prices, policies",
      "Medical, legal, financial guidance",
    ],
  },
  {
    title: "Give it better instructions",
    icon: "💡",
    color: LV.blue,
    items: [
      "State your goal and audience",
      "Give relevant context and constraints",
      "Show an example of what \"good\" looks like",
      "Say the format you want",
      "\"Write a friendly email\" → \"Write a 120-word update for my team, using these 3 points, ending with a next step\"",
    ],
  },
];

export default function AiFluencyCheatSheet() {
  return (
    <div className="w-full rounded-2xl overflow-hidden" style={{ background: LV.bg, border: `1px dashed ${LV.border}` }}>
      <div className="px-5 sm:px-6 py-4" style={{ borderBottom: `1px solid ${LV.border}` }}>
        <p className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: LV.inkOnNavySoft }}>
          AI Fluency — Quick Reference
        </p>
        <p className="text-sm" style={{ color: LV.inkOnNavy }}>
          Bookmark this. Come back to it any time you're about to use an AI tool.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 p-5 sm:p-6">
        {COLUMNS.map((col) => (
          <div key={col.title} className="rounded-xl p-4" style={{ background: LV.bgRaised, borderTop: `3px solid ${col.color}` }}>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-1.5" style={{ color: col.color }}>
              <span aria-hidden>{col.icon}</span>
              {col.title}
            </h3>
            <ul className="flex flex-col gap-2">
              {col.items.map((item) => (
                <li key={item} className="text-xs leading-relaxed flex items-start gap-1.5" style={{ color: LV.inkOnNavySoft }}>
                  <span aria-hidden style={{ color: col.color }}>
                    •
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="px-5 sm:px-6 py-3.5" style={{ borderTop: `1px solid ${LV.border}` }}>
        <p className="text-xs" style={{ color: LV.inkOnNavySoft }}>
          <span className="font-mono font-semibold" style={{ color: LV.violet }}>
            The one thing to remember:
          </span>{" "}
          confidence is a writing style, not a receipt. Use AI to accelerate your thinking — not to replace your judgment.
        </p>
      </div>
    </div>
  );
}
