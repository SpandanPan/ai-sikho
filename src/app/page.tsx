import Image from "next/image";
import PulseFeed from "@/components/PulseFeed";
import FunFactLoader from "@/components/FunFactLoader";
import TrackedLink from "@/components/TrackedLink";
import SoftGate from "@/components/SoftGate";
import WorkWithMe from "@/components/WorkWithMe";
import NewsletterSignup from "@/components/NewsletterSignup";
import MythFactStrip from "@/components/MythFactStrip";

const morePrep = [
  { title: "Go deep on one topic", desc: "RAG, Knowledge Graphs, LLM Observability — short courses with real demos.", price: "From ₹149", href: "/courses", locked: false },
  { title: "Time with someone who's done it", desc: "1:1 career guidance, slots open on a rolling 15-day window.", price: "Book a slot", href: "/mentoring", locked: true },
  { title: "Real feedback on a mock answer", desc: "AI-graded, specific to what you actually wrote — not a generic rubric.", price: "₹149", href: "/mock-feedback", locked: true },
];

const personas = [
  { photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&q=80", label: "Career switcher", detail: "No CS degree — now shipping RAG apps" },
  { photo: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&q=80", label: "Fresh graduate", detail: "Landed a first AI Engineer role" },
  { photo: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=200&q=80", label: "Small business owner", detail: "Automated support with one weekend build" },
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
    <main className="mx-auto max-w-5xl px-5">
      <FunFactLoader />

      <header className="relative -mx-5 sm:mx-0 sm:rounded-b-lg overflow-hidden min-h-[420px] flex items-end">
        <Image
          src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1600&q=80"
          alt="A person working at a laptop"
          fill
          priority
          className="object-cover -z-20"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/75 to-ink/25" />
        <div className="relative px-6 sm:px-10 py-12 text-paper">
          <p className="font-mono text-xs uppercase tracking-widest text-spark mb-3">All things AI</p>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold max-w-2xl text-balance leading-tight">
            The future is here. AI is already changing how we work, learn, and build.
          </h1>
          <p className="mt-4 max-w-xl text-paper/85">
            A daily read on what&apos;s actually happening in AI, what each model costs to run, and a
            structured way to prep for a GenAI or Agentic AI interview.
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

      <section id="pack" className="border-b border-paper-line py-9">
        <h2 className="font-display text-xl font-semibold mb-2 flex items-center gap-2">
          Interview Pack <span title="Paid" aria-label="Paid">🔒</span>
        </h2>
        <p className="text-sm text-ink-soft mb-5 max-w-lg">
          Start at ₹100. If it delivers, the ₹999 Kit and the paid courses are the natural next step —
          not the other way around.
        </p>
        <div className="grid gap-3.5 sm:grid-cols-[1fr_1.3fr]">
          <div className="border border-paper-line rounded p-5 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold mb-1">Starter Pack</h3>
              <p className="text-sm text-ink-soft">25 questions + 1 checklist. A taste of the full kit.</p>
            </div>
            <div className="font-mono text-xl text-accent-ink mt-3">₹100</div>
          </div>
          <div className="border border-accent rounded p-5 bg-paper-raised flex flex-col justify-between">
            <div>
              <h3 className="font-semibold mb-1">Senior GenAI Engineer Interview Kit</h3>
              <p className="text-sm text-ink-soft">100 questions, 30 system-design scenarios, 10 diagrams, 5 checklists.</p>
            </div>
            <div className="font-mono text-xl text-accent-ink mt-3">₹999</div>
          </div>
        </div>
        <p className="text-sm mt-4">
          Want a deeper dive on one topic instead? <a href="/courses" className="text-accent-ink underline">See the ₹149–199 courses →</a>
        </p>
      </section>

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

      <section className="border-b border-paper-line py-8">
        <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-4">Who this is for</p>
        <div className="grid gap-4 sm:grid-cols-3">
          {personas.map((p) => (
            <div key={p.label} className="flex items-center gap-3">
              <Image
                src={p.photo}
                alt=""
                width={52}
                height={52}
                className="rounded-full object-cover w-[52px] h-[52px]"
              />
              <div>
                <p className="text-sm font-semibold">{p.label}</p>
                <p className="text-xs text-ink-soft">{p.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <MythFactStrip />

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

        <PulseFeed />
      </SoftGate>

      <section className="border-b border-paper-line py-9">
        <h2 className="font-display text-lg font-semibold mb-1">Get the free digest</h2>
        <p className="text-sm text-ink-soft mb-4 max-w-md">
          The plain-language version of what actually happened in AI this week — no spam, unsubscribe
          any time.
        </p>
        <NewsletterSignup source="homepage" />
      </section>

      <footer id="work" className="py-10">
        <div className="border border-paper-line rounded p-6">
          <WorkWithMe />
        </div>
      </footer>
    </main>
  );
}
