import { articles, levelInfo, startHereSlug, type Level } from "@/data/articles";

const levelStyle: Record<Level, string> = {
  starter: "text-accent2 bg-accent2/15",
  builder: "text-accent-ink bg-accent/20",
  architect: "text-rust bg-rust/15",
};

const LEVEL_ORDER: Level[] = ["starter", "builder", "architect"];

function ArticleCard({ slug, title, summary, readMinutes, topic }: { slug: string; title: string; summary: string; readMinutes?: number; topic?: string }) {
  return (
    <a href={`/articles/${slug}`} className="block border border-paper-line rounded p-4 hover:border-accent-ink transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-sm">{title}</h3>
          <p className="text-sm text-ink-soft mt-1">{summary}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2.5">
        {readMinutes && <span className="font-mono text-[10.5px] text-ink-soft">{readMinutes} min</span>}
        {readMinutes && topic && <span className="text-ink-soft" aria-hidden>·</span>}
        {topic && <span className="font-mono text-[10.5px] text-ink-soft">{topic}</span>}
        <span className="font-mono text-[10.5px] uppercase text-accent-ink ml-auto whitespace-nowrap">Read →</span>
      </div>
    </a>
  );
}

// Coming-soon pieces are deliberately NOT rendered as individual cards —
// a library that's mostly "coming soon" cards reads as a catalogue of
// promises, not a resource. One condensed line says the same honest
// thing (this exists, isn't written yet) without dominating the section.
function ComingSoonLine({ items }: { items: { slug: string; title: string }[] }) {
  if (items.length === 0) return null;
  return (
    <p className="text-xs text-ink-soft mt-3">
      <span className="font-mono uppercase tracking-widest text-[10px] mr-1.5">Also coming:</span>
      {items.map((a, i) => (
        <span key={a.slug}>
          {a.title}
          {i < items.length - 1 ? " · " : ""}
        </span>
      ))}
    </p>
  );
}

function LevelSection({ level, index }: { level: Level; index: number }) {
  const items = articles.filter((a) => a.level === level && !a.archived);
  const published = items.filter((a) => a.status === "published");
  const comingSoon = items.filter((a) => a.status !== "published");
  const info = levelInfo[level];
  if (items.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-mono text-[10.5px] text-ink-soft" aria-hidden>
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className={`font-mono text-[10.5px] uppercase tracking-widest rounded-full px-2.5 py-0.5 ${levelStyle[level]}`}>
          {info.label}
        </span>
      </div>
      <p className="text-sm text-ink-soft mb-4 max-w-lg">{info.tagline}</p>

      {level === "starter" && (
        <a
          href={`/articles/${startHereSlug}`}
          className="inline-flex items-center gap-1.5 font-mono text-xs text-accent-ink underline mb-4"
        >
          New to AI? Start here →
        </a>
      )}

      {published.length > 0 ? (
        <div className="flex flex-col gap-2">
          {published.map((a) => (
            <ArticleCard key={a.slug} slug={a.slug} title={a.title} summary={a.summary} readMinutes={a.readMinutes} topic={a.topic} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-ink-soft italic">Nothing published at this level yet.</p>
      )}

      <ComingSoonLine items={comingSoon} />
    </div>
  );
}

// Evergreen pieces, kept separate from "what's current" — see the
// `archived` note on the Article type. Nothing lives here yet (no
// articles are published at all today), but the section exists so
// content has somewhere to move once it does.
function ArchiveSection() {
  const items = articles.filter((a) => a.archived);
  if (items.length === 0) return null;
  return (
    <div className="mt-4 pt-8 border-t border-paper-line">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-mono text-[10.5px] uppercase tracking-widest rounded-full px-2.5 py-0.5 text-ink-soft bg-paper-line/60">
          Archive
        </span>
      </div>
      <p className="text-sm text-ink-soft mb-4 max-w-lg">
        Older, but still accurate — concepts that don&apos;t go stale, kept separate from newer pieces.
      </p>
      <div className="flex flex-col gap-2">
        {items.map((a) => <ArticleCard key={a.slug} slug={a.slug} title={a.title} summary={a.summary} readMinutes={a.readMinutes} topic={a.topic} />)}
      </div>
    </div>
  );
}

export default function ArticlesPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-2">Free AI Library</p>
      <h1 className="font-display text-2xl font-semibold mb-2">Concepts, explained. Research, translated.</h1>
      <p className="text-ink-soft mb-1 max-w-xl">
        Three levels. One learning path — <b>Understand</b>, then <b>use &amp; build</b>, then <b>explore deeper</b>.
      </p>
      <p className="text-sm text-ink-soft mb-8 max-w-xl">AI shouldn&apos;t require a computer science degree.</p>

      {LEVEL_ORDER.map((level, i) => (
        <LevelSection key={level} level={level} index={i} />
      ))}
      <ArchiveSection />
    </main>
  );
}
