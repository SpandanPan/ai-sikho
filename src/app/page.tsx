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
import AboutUs from "@/components/AboutUs";

const morePrep = [
  { title: "Go deep on one topic", desc: "RAG, Knowledge Graphs, LLM Observability, and a no-code AI Fluency track — short courses with real demos.", price: "From ₹99", href: "/courses", locked: false },
  { title: "Time with someone who's done it", desc: "1:1 career guidance, slots open on a rolling 15-day window.", price: "Book a slot", href: "/mentoring", locked: true },
  { title: "Real feedback on a mock answer", desc: "AI-graded, specific to what you actually wrote. 1 free/month — we even tell you which model graded you.", price: "Free or ₹149", href: "/mock-feedback", locked: false },
];

const freeTools = [
  { name: "Ollama", best: "local & private", desc: "Runs open models (Llama, Mistral, Gemma, Qwen, DeepSeek) fully on your own machine — no account, no bill." },
  { name: "Hugging Face", best: "exploring models", desc: "Free-tier inference, thousands of downloadable open weights, and live demo Spaces." },
  { name: "LM Studio", best: "no command line", desc: "A desktop app for running local models — same idea as Ollama with a GUI." },
  { name: "Google AI Studio", best: "fast prototyping", desc: "A generous free daily quota on Gemini Flash and Flash-Lite." },
  { name: "Groq", best: "speed", desc: "A free API tier serving open models at unusually high inference speed." },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-5">
      <FunFactLoader />

      <header className="relative -mx-5 sm:mx-0 sm:rounded-b-lg overflow-hidden min-h-[260px] sm:min-h-[300px] flex items-end">
        <Image
          src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1600&q=80"
          alt="A person working at a laptop"
          fill
          priority
          className="object-cover -z-20"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/75 to-ink/25" />
        <div className="relative px-6 sm:px-10 py-8 text-paper">
          <p className="font-mono text-xs uppercase tracking-widest text-spark mb-3">Democratizing AI</p>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold max-w-2xl text-balance leading-tight">
            AI shouldn&apos;t be a black box only a few people understand.
          </h1>
          <p className="mt-4 max-w-xl text-paper/85">
            A plain-language read on what&apos;s actually happening in AI, what each model costs to
            run, and a structured way to prep for a GenAI or Agentic AI interview — starting at ₹100,
            on purpose.
          </p>
          <TrackedLink
            href="/quiz"
            label="hero-quiz-cta"
            className="inline-block mt-6 rounded bg-spark text-ink font-mono text-sm font-semibold px-5 py-3"
          >
            Take the free 60-second AI quiz →
          </TrackedLink>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
        {/* AI Pulse as a persistent left sidebar on desktop — sticky below
            the nav, auto-scrolling vertically. On mobile there's no room
            for a permanent sidebar, so this moves to the end of the page
            (order-last) and the horizontal ticker fallback inside "Run It
            Free" below is what mobile visitors actually see. */}
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
            <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-4">Today, for free</p>
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
            <section id="free" className="border-b border-paper-line py-9">
              <h2 className="font-display text-xl font-semibold mb-1">Run It Free</h2>
              <p className="text-sm text-ink-soft mb-5">No API key charges — good enough to learn and prototype on.</p>
              <div className="grid gap-3.5 sm:grid-cols-3">
                {freeTools.map((t) => (
                  <div key={t.name} className="border border-paper-line rounded p-4">
                    <h3 className="font-semibold text-sm mb-1.5">{t.name}</h3>
                    <p className="text-sm text-ink-soft">{t.desc}</p>
                    <span className="mt-2 inline-block font-mono text-[10.5px] uppercase text-accent2">Best for: {t.best}</span>
                  </div>
                ))}
              </div>
            </section>

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
              <h2 className="font-display text-lg font-semibold mb-1">Get the free digest</h2>
              <p className="text-sm text-ink-soft mb-4 max-w-md">
                The plain-language version of what actually happened in AI this week — no spam,
                unsubscribe any time.
              </p>
              <NewsletterSignup source="homepage" />
            </div>
            <AboutUs />
          </footer>
        </main>
      </div>
    </div>
  );
}
