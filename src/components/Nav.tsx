"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

const links = [
  { href: "/quiz", label: "Quiz" },
  { href: "/#pulse", label: "Pulse" },
  { href: "/#free", label: "Run It Free" },
  { href: "/articles", label: "Articles" },
  { href: "/courses", label: "Courses" },
  { href: "/mentoring", label: "Mentoring", locked: true },
  { href: "/mock-feedback", label: "Mock Feedback" },
  { href: "/#pack", label: "Interview Pack", locked: true },
];

// A flat link list stopped fitting once Mentoring/Mock Feedback/Interview
// Pack were added on top of the original set — this collapses into a
// hamburger below ~900px instead of wrapping into a second and third row,
// which was the actual "hard to find things" problem on a phone.
export default function Nav() {
  const { status } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-paper border-b border-paper-line">
      <div className="mx-auto max-w-5xl px-5 py-3.5 flex items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-2 flex-none">
          <span className="w-6 h-6 rounded bg-ink text-paper font-display text-sm font-semibold flex items-center justify-center">
            M
          </span>
          <span className="font-display text-lg font-semibold">The Model Desk</span>
        </a>

        <div className="hidden lg:flex items-center gap-5 flex-wrap">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="font-mono text-xs text-ink-soft hover:text-accent-ink">
              {l.label}
              {l.locked && (
                <span className="ml-1" title="Paid" aria-label="Paid">
                  🔒
                </span>
              )}
            </a>
          ))}
          {status === "authenticated" ? (
            <a href="/profile" className="font-mono text-xs text-ink-soft hover:text-accent-ink">
              Profile
            </a>
          ) : (
            <a href="/signin" className="font-mono text-xs text-ink-soft hover:text-accent-ink">
              Sign in
            </a>
          )}
          <a href="/settings" className="font-mono text-xs text-ink-soft hover:text-accent-ink">
            Settings
          </a>
          <a href="/#work" className="font-mono text-xs bg-ink text-paper rounded px-3 py-1.5">
            Work With Me
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="lg:hidden font-mono text-xs border border-paper-line rounded px-2.5 py-1.5 flex-none"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-paper-line px-5 py-4 flex flex-col gap-3">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="font-mono text-sm text-ink-soft hover:text-accent-ink">
              {l.label}
              {l.locked && (
                <span className="ml-1" title="Paid" aria-label="Paid">
                  🔒
                </span>
              )}
            </a>
          ))}
          {status === "authenticated" ? (
            <a href="/profile" onClick={() => setOpen(false)} className="font-mono text-sm text-ink-soft hover:text-accent-ink">
              Profile
            </a>
          ) : (
            <a href="/signin" onClick={() => setOpen(false)} className="font-mono text-sm text-ink-soft hover:text-accent-ink">
              Sign in
            </a>
          )}
          <a href="/settings" onClick={() => setOpen(false)} className="font-mono text-sm text-ink-soft hover:text-accent-ink">
            Settings
          </a>
          <a href="/#work" onClick={() => setOpen(false)} className="font-mono text-sm bg-ink text-paper rounded px-3 py-2 self-start">
            Work With Me
          </a>
        </div>
      )}
    </nav>
  );
}
