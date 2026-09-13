"use client";

import { useSession } from "next-auth/react";

const links = [
  { href: "/quiz", label: "Quiz" },
  { href: "/#pulse", label: "Pulse" },
  { href: "/#costs", label: "Model Costs" },
  { href: "/#free", label: "Run It Free" },
  { href: "/articles", label: "Articles" },
  { href: "/courses", label: "Courses" },
  { href: "/mentoring", label: "Mentoring", locked: true },
  { href: "/mock-feedback", label: "Mock Feedback", locked: true },
  { href: "/#pack", label: "Interview Pack", locked: true },
  { href: "/settings", label: "Settings" },
];

export default function Nav() {
  const { status } = useSession();

  return (
    <nav className="sticky top-0 z-40 bg-paper border-b border-paper-line">
      <div className="mx-auto max-w-5xl px-5 py-3.5 flex items-center justify-between gap-4 flex-wrap">
        <a href="/" className="flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-ink text-paper font-display text-sm font-semibold flex items-center justify-center">
            M
          </span>
          <span className="font-display text-lg font-semibold">The Model Desk</span>
        </a>
        <div className="flex items-center gap-5 flex-wrap">
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
          {status !== "authenticated" && (
            <a href="/signin" className="font-mono text-xs text-ink-soft hover:text-accent-ink">
              Sign in
            </a>
          )}
          <a href="/#work" className="font-mono text-xs bg-ink text-paper rounded px-3 py-1.5">
            Work With Me
          </a>
        </div>
      </div>
    </nav>
  );
}
