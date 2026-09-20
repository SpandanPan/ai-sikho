"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import CartIcon from "./CartIcon";
import Logo from "./Logo";

// Trimmed to real pages only — the previous list also had #pulse/#free/#pack
// homepage-anchor shortcuts, which just duplicated what's already the first
// thing you see landing on "/". A nav should get you somewhere new.
const links = [
  { href: "/quiz", label: "Quiz" },
  { href: "/articles", label: "Articles" },
  { href: "/courses", label: "Learn" },
  { href: "/about", label: "About" },
];

// Mock Feedback lives under Mentoring now instead of as its own top-level
// tab — it's a companion offer to mentoring, not a separate destination.
const mentoringLinks = [
  { href: "/mentoring", label: "1:1 Mentoring", locked: true },
  { href: "/mock-feedback", label: "Mock Feedback" },
];

// Low-frequency utility links, pulled out of the always-visible nav (and,
// for the legal ones, out of the footer) into one "More" overflow menu —
// settings/help/legal are things people look for occasionally, not on
// every visit, so they don't need permanent top-bar real estate.
const moreLinks = [
  { href: "/settings", label: "Settings" },
  { href: "/help", label: "Help" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/refund-policy", label: "Refunds" },
];

function useOutsideClick(onOutside: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onOutside]);
  return ref;
}

function MentoringDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClick(() => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="font-mono text-xs text-ink-soft hover:text-accent-ink inline-flex items-center gap-1"
      >
        Mentoring
        <span className="text-[9px]" aria-hidden>
          {open ? "▲" : "▼"}
        </span>
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-2 w-44 border border-paper-line rounded bg-paper shadow-lg py-1.5 z-50">
          {mentoringLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 font-mono text-xs text-ink-soft hover:text-accent-ink hover:bg-paper-line/20"
            >
              {l.label}
              {l.locked && (
                <span className="ml-1" title="Paid" aria-label="Paid">
                  🔒
                </span>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function MoreDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClick(() => setOpen(false));

  return (
    <div className="relative hidden lg:block" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close more menu" : "Open more menu"}
        aria-expanded={open}
        className="font-mono text-sm text-ink-soft hover:text-accent-ink px-1.5 py-1 rounded hover:bg-paper-line/30"
      >
        ≡
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-40 border border-paper-line rounded bg-paper shadow-lg py-1.5 z-50">
          {moreLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 font-mono text-xs text-ink-soft hover:text-accent-ink hover:bg-paper-line/20"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Nav() {
  const { status } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-paper border-b border-paper-line">
      <div className="mx-auto max-w-5xl px-5 py-3.5 flex items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-2 flex-none">
          <Logo />
          <span className="font-display text-lg font-semibold">AI Sikho</span>
        </a>

        <div className="hidden lg:flex items-center gap-5 flex-wrap">
          <a href="/quiz" className="font-mono text-xs text-ink-soft hover:text-accent-ink">
            Quiz
          </a>
          <a href="/articles" className="font-mono text-xs text-ink-soft hover:text-accent-ink">
            Articles
          </a>
          <a href="/courses" className="font-mono text-xs text-ink-soft hover:text-accent-ink">
            Learn
          </a>
          <MentoringDropdown />
          <a href="/about" className="font-mono text-xs text-ink-soft hover:text-accent-ink">
            About
          </a>
          <a href="/#work" className="font-mono text-xs bg-ink text-paper rounded px-3 py-1.5">
            Work With Us
          </a>
        </div>

        <div className="flex items-center gap-3 flex-none">
          <MoreDropdown />
          <CartIcon />
          {status === "authenticated" ? (
            <a href="/profile" className="hidden lg:inline font-mono text-xs text-ink-soft hover:text-accent-ink">
              Profile
            </a>
          ) : (
            <a href="/signin" className="hidden lg:inline font-mono text-xs text-ink-soft hover:text-accent-ink">
              Sign in
            </a>
          )}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="lg:hidden font-mono text-xs border border-paper-line rounded px-2.5 py-1.5"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-paper-line px-5 py-4 flex flex-col gap-3">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="font-mono text-sm text-ink-soft hover:text-accent-ink">
              {l.label}
            </a>
          ))}
          <div className="flex flex-col gap-3 pl-3 border-l border-paper-line">
            {mentoringLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="font-mono text-sm text-ink-soft hover:text-accent-ink">
                {l.label}
                {l.locked && (
                  <span className="ml-1" title="Paid" aria-label="Paid">
                    🔒
                  </span>
                )}
              </a>
            ))}
          </div>
          {status === "authenticated" ? (
            <a href="/profile" onClick={() => setOpen(false)} className="font-mono text-sm text-ink-soft hover:text-accent-ink">
              Profile
            </a>
          ) : (
            <a href="/signin" onClick={() => setOpen(false)} className="font-mono text-sm text-ink-soft hover:text-accent-ink">
              Sign in
            </a>
          )}
          <a href="/#work" onClick={() => setOpen(false)} className="font-mono text-sm bg-ink text-paper rounded px-3 py-2 self-start">
            Work With Us
          </a>
          <div className="pt-3 border-t border-paper-line flex flex-col gap-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">More</p>
            {moreLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="font-mono text-sm text-ink-soft hover:text-accent-ink">
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
