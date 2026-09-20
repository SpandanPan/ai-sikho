// Role-based routing, complementary to StartHere.tsx's knowledge-level
// routing — not everyone visiting thinks "I'm a beginner," but most people
// know their job title. Reinforces "AI for Everyone" by naming roles that
// have nothing to do with engineering.

const ROLES = [
  { role: "Student", start: "AI fundamentals", href: "#learn-ai" },
  { role: "Manager", start: "AI for decision-making", href: "/articles/how-ai-is-changing-jobs" },
  { role: "Marketer", start: "AI for content & research", href: "/articles/prompting-101" },
  { role: "Finance", start: "AI for analysis", href: "/articles/what-is-rag" },
  { role: "HR", start: "AI for recruiting", href: "/articles/how-ai-is-changing-jobs" },
  { role: "Developer", start: "Build with AI", href: "/courses" },
  { role: "Doctor", start: "AI in healthcare", href: "/articles/ai-in-your-day" },
  { role: "Entrepreneur", start: "Automate workflows", href: "#work" },
];

export default function AiForYourJob() {
  return (
    <section className="border-b border-paper-line py-9">
      <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-1">AI for your job</p>
      <h2 className="font-display text-xl font-semibold mb-5">You don&apos;t have to become an AI engineer to use AI.</h2>
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {ROLES.map((r) => (
          <a
            key={r.role}
            href={r.href}
            className="border border-paper-line rounded p-3.5 hover:border-accent transition-colors flex flex-col gap-0.5"
          >
            <span className="font-semibold text-sm">{r.role}</span>
            <span className="text-xs text-accent-ink">{r.start} →</span>
          </a>
        ))}
      </div>
    </section>
  );
}
