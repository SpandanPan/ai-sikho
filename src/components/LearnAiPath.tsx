import { articles } from "@/data/articles";

// The homepage's "map" for a total beginner — 10 steps in a suggested
// order, each pointing at a real article (published or not). Three steps
// already have real content; the other seven are honest "not written yet"
// placeholders (same pattern as every other coming-soon article on the
// site) rather than dead links, so the path is real today even though
// it's not finished.
const STEPS = [
  { slug: "what-is-ai" },
  { slug: "ai-vs-ml-vs-dl" },
  { slug: "what-is-generative-ai" },
  { slug: "what-is-an-llm" },
  { slug: "how-chatgpt-works" },
  { slug: "prompting-101" },
  { slug: "chatbot-or-agent" },
  { slug: "what-is-rag" },
  { slug: "what-are-ai-agents" },
  { slug: "how-ai-is-changing-jobs" },
];

export default function LearnAiPath() {
  return (
    <section id="learn-ai" className="border-b border-paper-line py-10">
      <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-1">Learn AI from zero</p>
      <h2 className="font-display text-xl font-semibold mb-6">No computer science degree required.</h2>

      <ol className="flex flex-col">
        {STEPS.map((step, i) => {
          const article = articles.find((a) => a.slug === step.slug);
          if (!article) return null;
          const isLast = i === STEPS.length - 1;
          const isPublished = article.status === "published";
          return (
            <li key={step.slug} className="relative pl-10 pb-5 last:pb-0">
              {!isLast && <span className="absolute left-[15px] top-7 bottom-0 w-px bg-paper-line" aria-hidden />}
              <span
                className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center font-mono text-[11px] font-semibold ${
                  isPublished ? "bg-ink text-paper" : "border border-paper-line text-ink-soft"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <a href={`/articles/${step.slug}`} className="group flex items-center justify-between gap-3 py-1">
                <span className={`text-sm font-medium ${isPublished ? "group-hover:text-accent-ink" : "text-ink-soft"}`}>
                  {article.title}
                </span>
                <span className="font-mono text-[10px] uppercase text-ink-soft whitespace-nowrap flex-none">
                  {isPublished ? "Read →" : "Coming soon"}
                </span>
              </a>
            </li>
          );
        })}
      </ol>

      <a href="/articles" className="inline-block mt-5 font-mono text-xs text-accent-ink underline">
        See the full path →
      </a>
    </section>
  );
}
