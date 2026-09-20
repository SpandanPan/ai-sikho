"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import CartIcon from "./CartIcon";
import Logo from "./Logo";

// Trimmed to real pages only — the previous list also had #pulse/#free/#pack
// homepage-anchor shortcuts, which just duplicated what's already the first
// thing you see landing on "/". A nav should get you somewhere new.
//
// Desktop and mobile both render this same array now (via NavLink) instead
// of each hardcoding its own <a> tags — that duplication is exactly what
// let "Courses" get renamed to "Learn" on mobile but not desktop earlier.
const links = [
  { href: "/", label: "Home", exact: true },
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

function isPathActive(pathname: string | null, href: string, exact?: boolean) {
  if (!pathname) return false;
  return exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");
}

function NavLink({
  href,
  label,
  active,
  mobile = false,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  mobile?: boolean;
  onClick?: () => void;
}) {
  const size = mobile ? "text-sm" : "text-xs";
  return (
    <a
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`font-mono ${size} transition-colors ${
        active ? "text-accent-ink font-semibold" : "text-ink-soft hover:text-accent-ink"
      }`}
    >
      {label}
    </a>
  );
}

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

function MentoringDropdown({ active }: { active: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClick(() => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-current={active ? "page" : undefined}
        className={`font-mono text-xs inline-flex items-center gap-1 transition-colors ${
          active ? "text-accent-ink font-semibold" : "text-ink-soft hover:text-accent-ink"
        }`}
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
        className="font-mono text-2xl leading-none text-ink-soft hover:text-accent-ink px-2 py-1.5 rounded hover:bg-paper-line/30"
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
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const mentoringActive = isPathActive(pathname, "/mentoring") || isPathActive(pathname, "/mock-feedback");

  return (
    <nav className="sticky top-0 z-40 bg-paper border-b border-paper-line">
      <div className="mx-auto max-w-5xl px-5 py-3.5 flex items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-2 flex-none">
          <Logo />
          <span className="font-display text-lg font-semibold">AI Sikho</span>
        </a>

        <div className="hidden lg:flex items-center gap-5 flex-wrap">
          {links.map((l) => (
            <NavLink key={l.href} href={l.href} label={l.label} active={isPathActive(pathname, l.href, l.exact)} />
          ))}
          <MentoringDropdown active={mentoringActive} />
          <a
            href="/work-with-us"
            aria-current={isPathActive(pathname, "/work-with-us") ? "page" : undefined}
            className={`font-mono text-xs rounded px-3 py-1.5 transition-colors ${
              isPathActive(pathname, "/work-with-us") ? "bg-accent-ink text-paper" : "bg-ink text-paper hover:bg-ink/85"
            }`}
          >
            Work With Us
          </a>
        </div>

        <div className="flex items-center gap-3 flex-none">
          <MoreDropdown />
          <CartIcon />
          {status === "authenticated" ? (
            <NavLink href="/profile" label="Profile" active={isPathActive(pathname, "/profile")} />
          ) : (
            <NavLink href="/signin" label="Sign in" active={isPathActive(pathname, "/signin")} />
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
            <NavLink
              key={l.href}
              href={l.href}
              label={l.label}
              active={isPathActive(pathname, l.href, l.exact)}
              mobile
              onClick={() => setOpen(false)}
            />
          ))}
          <div className="flex flex-col gap-3 pl-3 border-l border-paper-line">
            {mentoringLinks.map((l) => (
              <NavLink
                key={l.href}
                href={l.href}
                label={l.locked ? `${l.label} 🔒` : l.label}
                active={isPathActive(pathname, l.href)}
                mobile
                onClick={() => setOpen(false)}
              />
            ))}
          </div>
          {status === "authenticated" ? (
            <NavLink href="/profile" label="Profile" active={isPathActive(pathname, "/profile")} mobile onClick={() => setOpen(false)} />
          ) : (
            <NavLink href="/signin" label="Sign in" active={isPathActive(pathname, "/signin")} mobile onClick={() => setOpen(false)} />
          )}
          <a
            href="/work-with-us"
            onClick={() => setOpen(false)}
            aria-current={isPathActive(pathname, "/work-with-us") ? "page" : undefined}
            className={`font-mono text-sm rounded px-3 py-2 self-start transition-colors ${
              isPathActive(pathname, "/work-with-us") ? "bg-accent-ink text-paper" : "bg-ink text-paper"
            }`}
          >
            Work With Us
          </a>
          <div className="pt-3 border-t border-paper-line flex flex-col gap-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">More</p>
            {moreLinks.map((l) => (
              <NavLink key={l.href} href={l.href} label={l.label} active={isPathActive(pathname, l.href)} mobile onClick={() => setOpen(false)} />
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
