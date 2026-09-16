"use client";

import { useState } from "react";
import { courses, formatPrice, type Course } from "@/data/courses";
import RagDemo from "@/components/RagDemo";
import CourseTracker from "@/components/CourseTracker";
import AddToCartButton from "@/components/AddToCartButton";

const TABS: { key: Course["category"]; label: string; blurb: string }[] = [
  {
    key: "fluency",
    label: "AI Fluency — no code",
    blurb: "For using AI well in your current job — writing, research, analysis, admin work. No programming, no interview prep.",
  },
  {
    key: "technical",
    label: "For AI/GenAI Engineers",
    blurb: "The foundations are free. The parts that actually differentiate an AI Engineer — RAG, graphs, and production observability — are nominally priced.",
  },
];

export default function CoursesPage() {
  const [tab, setTab] = useState<Course["category"]>("fluency");
  const [expanded, setExpanded] = useState<string | null>(null);
  const visible = courses.filter((c) => c.category === tab);
  const activeTab = TABS.find((t) => t.key === tab)!;

  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-2">Short courses</p>
      <h1 className="font-display text-2xl font-semibold mb-6">One topic, one sitting, no fluff.</h1>

      <div className="flex gap-2 mb-5">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`font-mono text-xs rounded px-3 py-1.5 border transition-colors ${
              t.key === tab ? "bg-ink text-paper border-ink" : "border-paper-line text-ink-soft hover:border-accent"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p className="text-ink-soft mb-8 max-w-xl">{activeTab.blurb}</p>

      <div className="flex flex-col gap-3">
        {visible.map((c) => (
          <div key={c.slug} className="border border-paper-line rounded p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h2 className="font-semibold flex items-center gap-1.5">
                  {c.title}
                  {c.priceInPaise > 0 && (
                    <span title="Paid" aria-label="Paid">
                      🔒
                    </span>
                  )}
                </h2>
                <p className="text-sm text-ink-soft mt-1 max-w-lg">{c.summary}</p>
                <button
                  onClick={() => setExpanded(expanded === c.slug ? null : c.slug)}
                  className="font-mono text-[10.5px] text-accent-ink underline mt-1.5"
                >
                  {expanded === c.slug ? "Show less" : "More about this course →"}
                </button>
                {expanded === c.slug && (
                  <p className="text-sm text-ink-soft mt-2 max-w-lg border-l-2 border-accent pl-3">{c.description}</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span
                  className={`font-mono text-sm whitespace-nowrap ${
                    c.priceInPaise === 0 ? "text-accent2" : "text-accent-ink"
                  }`}
                >
                  {formatPrice(c.priceInPaise)}
                </span>
                {c.priceInPaise > 0 && (
                  <AddToCartButton
                    item={{ key: `course:${c.slug}`, type: "course", slug: c.slug, label: c.title, amountInPaise: c.priceInPaise }}
                    className="font-mono text-[10.5px] border border-paper-line rounded px-2.5 py-1.5"
                  />
                )}
              </div>
            </div>
            {c.hasDemo && (
              <div className="mt-4">
                <RagDemo />
              </div>
            )}
            <CourseTracker slug={c.slug} />
          </div>
        ))}
      </div>
      {visible.some((c) => c.priceInPaise > 0) && (
        <p className="text-[10.5px] text-ink-soft mt-4">
          Paid courses are non-refundable once purchased — see <a href="/refund-policy" className="underline">refund policy</a>.
        </p>
      )}
    </main>
  );
}
