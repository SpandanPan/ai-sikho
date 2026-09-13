"use client";

import { useEffect, useRef, useState } from "react";
import { getAutoScrollPref } from "./MotionToggle";

type NewsItem = { id: string; source: string; title: string; summary: string; link: string };

const SAMPLE: NewsItem[] = [
  { id: "1", source: "New model", title: "A major lab's newest model plans its answer before it starts writing.", summary: "Fewer wrong-but-confident answers on multi-step questions.", link: "#" },
  { id: "2", source: "Careers", title: "Why \"agentic\" suddenly shows up in half of new engineering job posts.", summary: "The skill bar for AI Engineer roles just moved.", link: "#" },
  { id: "3", source: "Real world", title: "A hospital radiology team is using AI as a second pair of eyes on scans.", summary: "A concrete case of AI catching what humans missed.", link: "#" },
  { id: "4", source: "Trend", title: "Open-weight models just closed most of the gap with closed ones.", summary: "\"Free\" and \"good\" are no longer opposites.", link: "#" },
];

// Fetches live items from Postgres via /api/news (populated by the daily
// fetch-news cron job). Falls back to sample cards if the table is empty —
// so the page never looks broken before the DB is wired up.
export default function PulseFeed() {
  const [items, setItems] = useState<NewsItem[]>(SAMPLE);
  const [live, setLive] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const hoveredRef = useRef(false);
  const enabledRef = useRef(true); // the persisted setting, distinct from hover-pause

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then((data) => {
        if (data.items?.length) {
          setItems(data.items);
          setLive(true);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    enabledRef.current = getAutoScrollPref();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const id = setInterval(() => {
      if (hoveredRef.current || !enabledRef.current) return;
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 2) {
        track.scrollLeft = 0;
      } else {
        track.scrollLeft += 1;
      }
    }, 20);
    return () => clearInterval(id);
  }, [items]);

  return (
    <section id="pulse" className="border-b border-paper-line py-9">
      <div className="flex items-baseline justify-between flex-wrap gap-2 mb-4">
        <div>
          <h2 className="font-display text-xl font-semibold">AI Pulse</h2>
          <p className="text-sm text-ink-soft">A running feed of today&apos;s AI news — hover to pause.</p>
        </div>
        <span className="font-mono text-[10.5px] uppercase tracking-wide text-accent2 bg-accent2/15 rounded-full px-2 py-0.5">
          {live ? "Live" : "Sample content"}
        </span>
      </div>
      <div
        ref={trackRef}
        onMouseEnter={() => (hoveredRef.current = true)}
        onMouseLeave={() => (hoveredRef.current = false)}
        onTouchStart={() => (hoveredRef.current = true)}
        onTouchEnd={() => (hoveredRef.current = false)}
        className="flex gap-3.5 overflow-x-auto no-scrollbar"
      >
        {items.map((item) => (
          <a
            key={item.id}
            href={item.link}
            className="flex-none w-[250px] border border-paper-line rounded bg-paper-raised p-4 flex flex-col gap-2"
          >
            <span className="font-mono text-[10.5px] uppercase tracking-wide text-accent-ink">via {item.source}</span>
            <h3 className="text-sm font-semibold leading-snug">{item.title}</h3>
            <p className="text-xs text-ink-soft">{item.summary}</p>
            <span className="text-[11px] text-accent2 mt-auto">Read the full story →</span>
          </a>
        ))}
      </div>
    </section>
  );
}
