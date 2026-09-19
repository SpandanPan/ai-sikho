"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import CartIcon from "./CartIcon";
import Logo from "./Logo";

// Trimmed to real pages only — the previous list also had #pulse/#free/#pack
// homepage-anchor shortcuts, which just duplicated what's already the first
// thing you see landing on "/". A nav should get you somewhere new.
const links = [
  { href: "/quiz", label: "Quiz" },
  { href: "/articles", label: "Articles" },
  { href: "/courses", label: "Courses" },
  { href: "/mentoring", label: "Mentoring", locked: true },
  { href: "/mock-feedback", label: "Mock Feedback" },
  { href: "/about", label: "About" },
];

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
          <a href="/settings" className="font-mono text-xs text-ink-soft hover:text-accent-ink">
            Settings
          </a>
          <a href="/help" className="font-mono text-xs text-ink-soft hover:text-accent-ink">
            Help
          </a>
          <a href="/#work" className="font-mono text-xs bg-ink text-paper rounded px-3 py-1.5">
            Work With Me
          </a>
        </div>

        <div className="flex items-center gap-3 flex-none">
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
          <a href="/help" onClick={() => setOpen(false)} className="font-mono text-sm text-ink-soft hover:text-accent-ink">
            Help
          </a>
          <a href="/#work" onClick={() => setOpen(false)} className="font-mono text-sm bg-ink text-paper rounded px-3 py-2 self-start">
            Work With Me
          </a>
        </div>
      )}
    </nav>
  );
}
