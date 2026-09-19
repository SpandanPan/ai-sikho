const columns = [
  {
    heading: "Explore",
    links: [
      { href: "/quiz", label: "AI Quiz" },
      { href: "/articles", label: "Articles" },
      { href: "/#pulse", label: "AI Pulse" },
      { href: "/courses/ai-tools-to-try", label: "AI Tools to Try" },
    ],
  },
  {
    heading: "Prep",
    links: [
      { href: "/#pack", label: "Interview Pack" },
      { href: "/courses", label: "Courses" },
      { href: "/mentoring", label: "Mentoring (+ Mock Feedback)" },
    ],
  },
  {
    // Settings/Help/legal moved out of here into the "≡" overflow menu in
    // Nav.tsx (see moreLinks there) — this column used to hold them, but
    // duplicating the same links in both places defeats the point of
    // moving them, so Company now only keeps the two things worth a
    // permanent footer slot.
    heading: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/#work", label: "Work With Us" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-paper-line mt-12">
      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="grid gap-8 sm:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <span className="font-display text-lg font-semibold">AI Sikho</span>
            <p className="text-sm text-ink-soft mt-2 max-w-[24ch]">
              All things AI — explained, priced, and interview-ready.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.heading}>
              <p className="font-mono text-[10.5px] uppercase tracking-widest text-ink-soft mb-3">{col.heading}</p>
              <div className="flex flex-col gap-2">
                {col.links.map((l) => (
                  <a key={l.href} href={l.href} className="text-sm text-ink-soft hover:text-accent-ink">
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="font-mono text-[11px] text-ink-soft mt-10 pt-6 border-t border-paper-line">
          © {new Date().getFullYear()} AI Sikho
        </p>
      </div>
    </footer>
  );
}
