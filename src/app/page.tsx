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
import StartHere from "@/components/StartHere";
import LearnAiPath from "@/components/LearnAiPath";
import AiForYourJob from "@/components/AiForYourJob";
import { assetUrl } from "@/lib/assetUrl";

// Same order as the site's Mentoring nav dropdown (Nav.tsx) — mentoring
// itself, plus its companion mock-feedback offer. "Go deep on one topic"
// (the short paid courses) used to live in this grid too; it's covered
// now by the "I want to build with AI" card in StartHere instead, so
// Courses isn't duplicated as its own homepage section.
const mentoringOffers = [
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

      {/* HERO */}
      <header className="relative -mx-5 sm:mx-0 rounded-b-lg overflow-hidden bg-ink text-paper">
        <div className="relative grid lg:grid-cols-[1.1fr_1fr] gap-6 items-center px-5 sm:px-8 py-8 sm:py-10">
          <div>
            <p className="font-mono text-[10.5px] uppercase tracking-widest text-spark mb-2 font-semibold">Democratizing AI</p>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-balance leading-tight mb-3">
              AI for Everyone, Not Just a Few.
            </h1>
            <p className="text-base font-semibold text-paper mb-1.5">Learn AI without the jargon.</p>
            <p className="text-sm sm:text-[15px] text-paper/75 max-w-md leading-relaxed mb-5">
              Plain-English explainers, interactive demos, practical guides, and career resources —
              built for people starting from zero.
            </p>
            <div className="flex items-center gap-4 flex-wrap mb-6">
              <a
                href="#start-here"
                className="inline-block rounded bg-spark text-ink font-mono text-xs font-semibold px-4 py-2.5"
              >
                Start Learning AI →
              </a>
              <TrackedLink
                href="/quiz"
                label="hero-quiz-cta"
                className="font-mono text-xs text-paper/80 hover:text-paper"
              >
                Take the 60-second AI quiz →
              </TrackedLink>
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
              src={assetUrl("/home/hero-illustration.png")}
              alt="A diverse group learning AI together around a laptop, with a glowing lightbulb reading 'AI for a brighter tomorrow' above them."
              width={793}
              height={505}
              priority
              className="w-full h-auto"
            />
          </div>
        </div>
      </header>

      <main className="mt-2">
        {/* START HERE */}
        <StartHere />

        {/* LEARN AI */}
        <LearnAiPath />

        <section className="border-b border-paper-line py-9">
          <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-4">Today&apos;s dose</p>
          <div className="grid gap-4 lg:grid-cols-2">
            <MythFactStrip />
            <TermOfDay />
          </div>
        </section>

        {/* TRY AI */}
        <section className="border-b border-paper-line py-9">
          <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-1">Don&apos;t just read about AI</p>
          <h2 className="font-display text-xl font-semibold mb-5">Try it.</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            <TokenizerDemo />
            <AgentWorkflowDemo />
          </div>
        </section>

        <IndicLanguageSection />

        {/* AI PULSE — a normal section now, not a tall sticky sidebar */}
        <SoftGate>
          <PulseFeed orientation="horizontal" />
        </SoftGate>

        {/* AI FOR YOUR JOB */}
        <AiForYourJob />

        {/* CAREER / INTERVIEW */}
        <section id="career">
          <InterviewPackSection />
        </section>

        {/* MENTORING */}
        <section className="border-b border-paper-line py-9">
          <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-4">Want to talk to someone who&apos;s done it?</p>
          <div className="grid gap-3.5 sm:grid-cols-2">
            {mentoringOffers.map((m) => (
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

        {/* BUSINESS / WORK WITH ME */}
        <section id="work" className="border-b border-paper-line py-9">
          <div className="border border-paper-line rounded p-6">
            <WorkWithMe />
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="py-10">
          <div className="border border-paper-line rounded p-6">
            <h2 className="font-display text-lg font-semibold mb-1">Get the digest</h2>
            <p className="text-sm text-ink-soft mb-4 max-w-md">
              The plain-language version of what actually happened in AI this week — no spam,
              unsubscribe any time.
            </p>
            <NewsletterSignup source="homepage" />
          </div>
        </section>
      </main>
    </div>
  );
}
