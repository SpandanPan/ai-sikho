// The homepage's self-identification section — right below the hero, so a
// visitor can pick where they are instead of scanning the whole page to
// figure out what's relevant to them. See LearnAiPath.tsx for the section
// two of these cards route into.

const PATHS = [
  {
    emoji: "🌱",
    title: "I know nothing about AI",
    subtitle: "Start with the basics",
    items: ["AI vs ML vs Deep Learning", "What is an LLM?", "What is Generative AI?", "What is an AI Agent?"],
    cta: "Start learning →",
    href: "#learn-ai",
  },
  {
    emoji: "💬",
    title: "I want to use AI better",
    subtitle: "Learn how to work with AI",
    items: ["Prompting 101", "Chatbots vs Agents", "How to use AI at work", "AI mistakes to watch for"],
    cta: "Start using AI →",
    href: "#learn-ai",
  },
  {
    emoji: "🛠️",
    title: "I want to build with AI",
    subtitle: "Go one level deeper",
    items: ["APIs", "RAG", "Embeddings", "AI Agents", "Evaluations"],
    cta: "Start building →",
    href: "/courses",
  },
  {
    emoji: "🚀",
    title: "I want an AI career",
    subtitle: "Turn AI into a career skill",
    items: ["AI Engineer", "GenAI Engineer", "Data Scientist", "Interview preparation"],
    cta: "Explore careers →",
    href: "#career",
  },
];

export default function StartHere() {
  return (
    <section id="start-here" className="border-b border-paper-line py-10">
      <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-1">New to AI? Start here.</p>
      <h2 className="font-display text-xl font-semibold mb-6">You don&apos;t need a technical background. Pick where you are.</h2>
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {PATHS.map((p) => (
          <a
            key={p.title}
            href={p.href}
            className="border border-paper-line rounded-lg p-4 flex flex-col hover:border-accent transition-colors"
          >
            <span className="text-2xl mb-2" aria-hidden>
              {p.emoji}
            </span>
            <h3 className="font-semibold text-sm mb-0.5">{p.title}</h3>
            <p className="text-xs text-ink-soft mb-3">{p.subtitle}</p>
            <ul className="flex flex-col gap-1 mb-4">
              {p.items.map((item) => (
                <li key={item} className="text-xs text-ink-soft flex gap-1.5">
                  <span className="text-accent2 flex-none" aria-hidden>
                    ·
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <span className="font-mono text-xs text-accent-ink mt-auto">{p.cta}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
