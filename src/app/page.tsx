import Image from "next/image";
import PulseFeed from "@/components/PulseFeed";
import FunFactLoader from "@/components/FunFactLoader";
import TrackedLink from "@/components/TrackedLink";
import SoftGate from "@/components/SoftGate";
import WorkWithMe from "@/components/WorkWithMe";
import NewsletterSignup from "@/components/NewsletterSignup";
import MythFactStrip from "@/components/MythFactStrip";
import InterviewPackSection from "@/components/InterviewPackSection";
import TermOfDay from "@/components/TermOfDay";
import TokenizerDemo from "@/components/TokenizerDemo";
import AgentWorkflowDemo from "@/components/AgentWorkflowDemo";
import IndicLanguageSection from "@/components/IndicLanguageSection";

const morePrep = [
  { title: "Go deep on one topic", desc: "RAG, Knowledge Graphs, LLM Observability, and a no-code AI Fluency track — short courses with real demos.", price: "From ₹99", href: "/courses", locked: false },
  { title: "Time with someone who's done it", desc: "1:1 career guidance, slots open on a rolling 15-day window.", price: "Book a slot", href: "/mentoring", locked: true },
  { title: "Real feedback on a mock answer", desc: "AI-graded, specific to what you actually wrote. 1/month, no charge — we even tell you which grader graded you.", price: "1/month + ₹149", href: "/mock-feedback", locked: false },
];

const heroFeatures = [
  { label: "Learn\nat your pace", color: "bg-accent2/20 text-accent2", icon: "people" as const },
  { label: "Real-world\nexamples", color: "bg-accent-ink/20 text-accent-ink", icon: "book" as const },
  { label: "Career-ready\nskills", color: "bg-accent/25 text-accent-ink", icon: "cap" as const },
  { label: "Built for\ncurious minds", color: "bg-rust/20 text-rust", icon: "people" as const },
];

function HeroFeatureIcon({ icon }: { icon: "people" | "book" | "cap" }) {
  if (icon === "book") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
      </svg>
    );
  }
  if (icon === "cap") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M22 10 12 5 2 10l10 5 10-5Z" />
        <path d="M6 12v5c0 1.5 2.5 3 6 3s6-1.5 6-3v-5" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-5">
      <FunFactLoader />

      <header className="relative -mx-5 sm:mx-0 rounded-b-lg overflow-hidden bg-ink text-paper">
        <div className="relative grid lg:grid-cols-[1.1fr_1fr] gap-6 items-center px-5 sm:px-8 py-8 sm:py-10">
          <div>
            <p className="font-mono text-[10.5px] uppercase tracking-widest text-spark mb-2 font-semibold">Democratizing AI</p>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-balance leading-tight mb-3">
              AI for Everyone, Not Just a Few.
            </h1>
            <p className="text-sm sm:text-[15px] text-paper/75 max-w-md leading-relaxed mb-5">
              Practical, easy-to-understand resources to help you learn AI, build real skills, and
              open new opportunities — no fancy jargon, no prior experience required.
            </p>
            <div className="flex items-center gap-4 flex-wrap mb-6">
              <TrackedLink
                href="/quiz"
                label="hero-quiz-cta"
                className="inline-block rounded bg-spark text-ink font-mono text-xs font-semibold px-4 py-2.5"
              >
                Take the 60-second AI quiz →
              </TrackedLink>
              {/* No actual video exists yet — /intro is a real placeholder
                  page (not a fake anchor) so this is plumbed correctly and
                  just needs the actual video swapped in later. */}
              <a href="/intro" className="inline-flex items-center gap-2 font-mono text-xs text-paper/80 hover:text-paper">
                <span className="w-6 h-6 rounded-full border border-paper/40 flex items-center justify-center flex-none" aria-hidden>
                  ▶
                </span>
                Watch 1-min intro
              </a>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3">
              {heroFeatures.map((f) => (
                <div key={f.label} className="flex items-center gap-2">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center flex-none ${f.color}`}>
                    <HeroFeatureIcon icon={f.icon} />
                  </span>
                  <span className="font-mono text-[10.5px] text-paper/75 leading-tight whitespace-pre-line">{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <Image
              src="/home/hero-illustration.png"
              alt="A diverse group learning AI together around a laptop, with a glowing lightbulb reading 'AI for a brighter tomorrow' above them."
              width={793}
              height={505}
              priority
              className="w-full h-auto"
            />
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 mt-8">
        {/* AI Pulse as a persistent left sidebar on desktop — sticky below
            the nav, auto-scrolling vertically. On mobile there's no room
            for a permanent sidebar, so this moves to the end of the page
            (order-last) and the horizontal ticker fallback further down
            is what mobile visitors actually see. */}
        <aside className="order-last lg:order-none lg:w-72 lg:flex-none">
          <div className="lg:sticky lg:top-20">
            <SoftGate>
              <PulseFeed orientation="vertical" />
            </SoftGate>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <InterviewPackSection />

          <section className="border-b border-paper-line py-9">
            <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-4">More ways to prep</p>
            <div className="grid gap-3.5 sm:grid-cols-3">
              {morePrep.map((m) => (
                <a key={m.title} href={m.href} className="border border-paper-line rounded p-4 hover:border-accent transition-colors">
                  <h3 className="font-semibold text-sm mb-1 flex items-center gap-1.5">
                    {m.title}
                    {m.locked && <span title="Paid" aria-label="Paid">🔒</span>}
                  </h3>
                  <p className="text-sm text-ink-soft mb-3">{m.desc}</p>
                  <span className="font-mono text-xs text-accent-ink">{m.price} →</span>
                </a>
              ))}
            </div>
          </section>

          <section className="border-b border-paper-line py-9">
            <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-4">Today's dose</p>
            <div className="grid gap-4 lg:grid-cols-2">
              <MythFactStrip />
              <TermOfDay />
            </div>
          </section>

          <section className="border-b border-paper-line py-9">
            <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-1">See it, don&apos;t just read about it</p>
            <h2 className="font-display text-xl font-semibold mb-5">Two things everyone asks about, live in your browser.</h2>
            <div className="grid gap-4 lg:grid-cols-2">
              <TokenizerDemo />
              <AgentWorkflowDemo />
            </div>
          </section>

          <IndicLanguageSection />

          <SoftGate>
            {/* Mobile-only fallback — the sidebar above is desktop-only (lg+) */}
            <div id="pulse" className="lg:hidden">
              <PulseFeed orientation="horizontal" />
            </div>
          </SoftGate>

          <footer id="work" className="py-10 flex flex-col gap-6">
            <div className="border border-paper-line rounded p-6">
              <WorkWithMe />
            </div>
            <div className="border border-paper-line rounded p-6">
              <h2 className="font-display text-lg font-semibold mb-1">Get the digest</h2>
              <p className="text-sm text-ink-soft mb-4 max-w-md">
                The plain-language version of what actually happened in AI this week — no spam,
                unsubscribe any time.
              </p>
              <NewsletterSignup source="homepage" />
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
