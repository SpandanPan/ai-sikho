"use client";

import { useEffect, useRef, useState } from "react";
import { getAutoScrollPref } from "./MotionToggle";

type NewsItem = { id: string; source: string; title: string; summary: string; link: string; takeaway?: string | null };

const SAMPLE: NewsItem[] = [
  { id: "1", source: "New model", title: "A major lab's newest model plans its answer before it starts writing.", summary: "Fewer wrong-but-confident answers on multi-step questions.", link: "#" },
  { id: "2", source: "Careers", title: "Why \"agentic\" suddenly shows up in half of new engineering job posts.", summary: "The skill bar for AI Engineer roles just moved.", link: "#" },
  { id: "3", source: "Real world", title: "A hospital radiology team is using AI as a second pair of eyes on scans.", summary: "A concrete case of AI catching what humans missed.", link: "#" },
  { id: "4", source: "Trend", title: "Open-weight models just closed most of the gap with closed ones.", summary: "\"Free\" and \"good\" are no longer opposites.", link: "#" },
];

// Fetches live items from Postgres via /api/news (populated by the daily
// fetch-news cron job). Falls back to sample cards if the table is empty —
// so the page never looks broken before the DB is wired up.
//
// "vertical" powers the sticky left sidebar (auto-scrolls scrollTop, not
// scrollLeft, inside a height-bounded column); "horizontal" is the
// original ticker, used as the mobile fallback where there's no room for
// a persistent sidebar. Same data, same auto-scroll preference either way.
export default function PulseFeed({ orientation = "horizontal" }: { orientation?: "horizontal" | "vertical" }) {
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
    const vertical = orientation === "vertical";
    const id = setInterval(() => {
      if (hoveredRef.current || !enabledRef.current) return;
      if (vertical) {
        if (track.scrollTop + track.clientHeight >= track.scrollHeight - 2) {
          track.scrollTop = 0;
        } else {
          track.scrollTop += 1;
        }
      } else {
        if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 2) {
          track.scrollLeft = 0;
        } else {
          track.scrollLeft += 1;
        }
      }
    }, 20);
    return () => clearInterval(id);
  }, [items, orientation]);

  const pauseHandlers = {
    onMouseEnter: () => (hoveredRef.current = true),
    onMouseLeave: () => (hoveredRef.current = false),
    onTouchStart: () => (hoveredRef.current = true),
    onTouchEnd: () => (hoveredRef.current = false),
  };

  if (orientation === "vertical") {
    return (
      <section className="w-full">
        <div className="flex items-baseline justify-between gap-2 mb-3">
          <h2 className="font-display text-sm font-semibold">AI Pulse</h2>
          <span className="font-mono text-[9px] uppercase tracking-wide text-accent2 bg-accent2/15 rounded-full px-1.5 py-0.5">
            {live ? "Live" : "Sample"}
          </span>
        </div>
        <div
          ref={trackRef}
          {...pauseHandlers}
          className="flex flex-col gap-2.5 overflow-y-auto no-scrollbar max-h-[65vh] pr-1"
        >
          {items.map((item) => (
            <a
              key={item.id}
              href={item.link}
              className="flex-none border border-paper-line rounded bg-paper-raised p-3 flex flex-col gap-1.5"
            >
              <span className="font-mono text-[9px] uppercase tracking-wide text-accent-ink">via {item.source}</span>
              <h3 className="text-xs font-semibold leading-snug">{item.title}</h3>
              {item.takeaway && (
                <p className="text-[10.5px] text-ink-soft border-l-2 border-accent pl-1.5">{item.takeaway}</p>
              )}
            </a>
          ))}
        </div>
      </section>
    );
  }

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
      <div ref={trackRef} {...pauseHandlers} className="flex gap-3.5 overflow-x-auto no-scrollbar">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.link}
            className="flex-none w-[250px] border border-paper-line rounded bg-paper-raised p-4 flex flex-col gap-2"
          >
            <span className="font-mono text-[10.5px] uppercase tracking-wide text-accent-ink">via {item.source}</span>
            <h3 className="text-sm font-semibold leading-snug">{item.title}</h3>
            <p className="text-xs text-ink-soft">{item.summary}</p>
            {item.takeaway && (
              <p className="text-[11px] text-ink-soft border-l-2 border-accent pl-2">{item.takeaway}</p>
            )}
            <span className="text-[11px] text-accent2 mt-auto">Read the full story →</span>
          </a>
        ))}
      </div>
    </section>
  );
}
