import WorkWithMe from "@/components/WorkWithMe";

// Moved off the homepage into its own page — was a same-page anchor
// section (id="work" / "/#work"), which meant the Nav link could never
// show as "active" the way every other tab does, and the homepage was
// carrying the full inquiry form + example gallery inline. Nav.tsx,
// Footer.tsx, and AiForYourJob.tsx all point here now instead of "/#work".
export default function WorkWithUsPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <a href="/" className="font-mono text-[10.5px] text-accent-ink underline inline-flex items-center gap-1 mb-8 hover:text-accent-ink/80 transition-colors">
        ← Back to AI Sikho
      </a>
      <div className="relative border border-accent/40 rounded-xl p-6 sm:p-7 overflow-hidden bg-gradient-to-br from-accent/5 via-transparent to-transparent">
        <WorkWithMe />
      </div>
    </main>
  );
}
