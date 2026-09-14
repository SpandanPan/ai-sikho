import { mythsFacts } from "@/data/mythsFacts";
import TrackedLink from "@/components/TrackedLink";

export default function MythFactStrip() {
  return (
    <section className="border-b border-paper-line py-9">
      <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-4">Myth vs fact</p>
      <div className="flex flex-col gap-2.5">
        {mythsFacts.map((mf) => (
          <div
            key={mf.myth}
            className="grid gap-1 sm:grid-cols-[1fr_1fr] sm:gap-4 border border-paper-line rounded p-4"
          >
            <p className="text-sm text-ink-soft">
              <span className="font-mono text-[10.5px] uppercase text-rust mr-1.5">Myth</span>
              {mf.myth}
            </p>
            <p className="text-sm">
              <span className="font-mono text-[10.5px] uppercase text-accent2 mr-1.5">Fact</span>
              {mf.fact}
            </p>
          </div>
        ))}
      </div>
      <TrackedLink
        href="/quiz"
        label="myth-fact-quiz-cta"
        className="inline-block mt-5 font-mono text-sm text-accent-ink underline"
      >
        Take the free quiz →
      </TrackedLink>
    </section>
  );
}
