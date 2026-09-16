import { mythsFacts } from "@/data/mythsFacts";
import TrackedLink from "@/components/TrackedLink";

// Trimmed to 3 (of 5) so this sits comfortably next to TermOfDay in a
// two-column grid instead of dwarfing it — full list stays in the data
// file for whenever this gets its own space again.
export default function MythFactStrip() {
  return (
    <div className="border border-paper-line rounded p-4">
      <p className="font-mono text-[10.5px] uppercase tracking-widest text-accent2 mb-3">Myth vs fact</p>
      <div className="flex flex-col gap-2.5">
        {mythsFacts.slice(0, 3).map((mf) => (
          <p key={mf.myth} className="text-sm">
            <span className="font-mono text-[10.5px] uppercase text-rust mr-1.5">Myth</span>
            <span className="text-ink-soft">{mf.myth}</span>
            <br />
            <span className="font-mono text-[10.5px] uppercase text-accent2 mr-1.5">Fact</span>
            {mf.fact}
          </p>
        ))}
      </div>
      <TrackedLink
        href="/quiz"
        label="myth-fact-quiz-cta"
        className="inline-block mt-4 font-mono text-xs text-accent-ink underline"
      >
        Take the free quiz →
      </TrackedLink>
    </div>
  );
}
