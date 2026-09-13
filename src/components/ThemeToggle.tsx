"use client";

import { useEffect, useState } from "react";

type Pref = "light" | "dark" | "system";

function apply(pref: Pref) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  if (pref !== "system") root.classList.add(pref);
}

export default function ThemeToggle() {
  const [pref, setPref] = useState<Pref>("system");

  useEffect(() => {
    let saved: Pref = "system";
    try {
      saved = (localStorage.getItem("theme") as Pref) || "system";
    } catch {
      // localStorage unavailable (private mode, etc.) — fall back silently.
    }
    setPref(saved);
  }, []);

  function choose(p: Pref) {
    setPref(p);
    apply(p);
    try {
      localStorage.setItem("theme", p);
    } catch {
      // best-effort only — the toggle still works for this page view.
    }
  }

  return (
    <div className="inline-flex rounded border border-paper-line overflow-hidden">
      {(["light", "system", "dark"] as Pref[]).map((p) => (
        <button
          key={p}
          onClick={() => choose(p)}
          aria-pressed={pref === p}
          className={`px-4 py-2 font-mono text-xs capitalize ${
            pref === p ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
          }`}
        >
          {p}
        </button>
      ))}
    </div>
  );
}
