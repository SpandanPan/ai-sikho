"use client";

import { useEffect, useState } from "react";

// Read by PulseFeed to decide whether the news ticker auto-scrolls.
export function getAutoScrollPref(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const saved = localStorage.getItem("autoScrollNews");
    if (saved !== null) return saved === "true";
  } catch {
    // ignore
  }
  // Default off for anyone whose OS says "reduce motion."
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function MotionToggle() {
  const [on, setOn] = useState(true);

  useEffect(() => setOn(getAutoScrollPref()), []);

  function toggle() {
    const next = !on;
    setOn(next);
    try {
      localStorage.setItem("autoScrollNews", String(next));
    } catch {
      // best-effort only
    }
  }

  return (
    <button
      onClick={toggle}
      aria-pressed={on}
      className={`px-4 py-2 rounded font-mono text-xs border ${
        on ? "bg-ink text-paper border-ink" : "border-paper-line text-ink-soft"
      }`}
    >
      Auto-scroll news ticker: {on ? "On" : "Off"}
    </button>
  );
}
