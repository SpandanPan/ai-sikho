"use client";

import { useState } from "react";
import { interviewPacks, formatPackPrice } from "@/data/interviewPacks";
import AddToCartButton from "@/components/AddToCartButton";

// Client component only because picking a track needs state — the rest of
// the homepage stays a server component. Same #pack anchor as before, so
// existing Nav/Footer links keep working.
export default function InterviewPackSection() {
  const [selected, setSelected] = useState(interviewPacks[0].slug);
  const pack = interviewPacks.find((p) => p.slug === selected) ?? interviewPacks[0];

  return (
    <section id="pack" className="border-b border-paper-line py-9">
      <h2 className="font-display text-xl font-semibold mb-2 flex items-center gap-2">
        Interview Pack <span title="Paid" aria-label="Paid">🔒</span>
      </h2>
      <p className="text-sm text-ink-soft mb-3 max-w-lg">
        Start at ₹100. If it delivers, the ₹999 Kit and the paid courses are the natural next step —
        not the other way around.
      </p>
      <p className="inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-wide text-accent2 border border-paper-line rounded-full px-2.5 py-1 mb-5">
        ✓ Curated by an AI Engineer with 10+ years of industry experience
      </p>

      <div className="flex flex-wrap gap-2 mb-5">
        {interviewPacks.map((p) => (
          <button
            key={p.slug}
            onClick={() => setSelected(p.slug)}
            className={`font-mono text-xs rounded px-3 py-1.5 border transition-colors ${
              p.slug === selected
                ? "bg-ink text-paper border-ink"
                : "border-paper-line text-ink-soft hover:border-accent"
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      <p className="text-sm text-ink-soft mb-4 max-w-lg">{pack.summary}</p>

      <div className="grid gap-3.5 sm:grid-cols-[1fr_1.3fr]">
        <div className="border border-paper-line rounded p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold mb-1">Starter Pack</h3>
            <p className="text-sm text-ink-soft">25 questions + 1 checklist. A taste of the full kit.</p>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="font-mono text-xl text-accent-ink">{formatPackPrice(pack.starterPriceInPaise)}</div>
            <AddToCartButton
              item={{ key: `pack-starter:${pack.slug}`, type: "pack-starter", slug: pack.slug, label: `${pack.title} — Starter Pack`, amountInPaise: pack.starterPriceInPaise }}
              className="font-mono text-[10.5px] border border-paper-line rounded px-2.5 py-1.5"
            />
          </div>
        </div>
        <div className="border border-accent rounded p-5 bg-paper-raised flex flex-col justify-between">
          <div>
            <h3 className="font-semibold mb-1">{pack.title} Interview Kit</h3>
            <p className="text-sm text-ink-soft">{pack.kitContents}.</p>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="font-mono text-xl text-accent-ink">{formatPackPrice(pack.kitPriceInPaise)}</div>
            <AddToCartButton
              item={{ key: `pack-kit:${pack.slug}`, type: "pack-kit", slug: pack.slug, label: `${pack.title} — Interview Kit`, amountInPaise: pack.kitPriceInPaise }}
              className="font-mono text-[10.5px] bg-ink text-paper rounded px-2.5 py-1.5"
            />
          </div>
        </div>
      </div>
      <p className="text-sm mt-4">
        <a href="/cart" className="text-accent-ink underline">View cart →</a>
      </p>
      <p className="text-sm mt-4">
        Want a deeper dive on one topic instead? <a href="/courses" className="text-accent-ink underline">See the ₹149–199 courses →</a>
      </p>
    </section>
  );
}
