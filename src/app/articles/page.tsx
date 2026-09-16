import { articles, levelInfo, type Level } from "@/data/articles";

const levelStyle: Record<Level, string> = {
  starter: "text-accent2 bg-accent2/15",
  builder: "text-accent-ink bg-accent/20",
  architect: "text-rust bg-rust/15",
};

function ArticleCard({ title, summary, status }: { title: string; summary: string; status: "coming-soon" | "published" }) {
  return (
    <div className="border border-paper-line rounded p-4 flex items-start justify-between gap-4">
      <div>
        <h3 className="font-semibold text-sm">{title}</h3>
        <p className="text-sm text-ink-soft mt-1">{summary}</p>
      </div>
      <span className="font-mono text-[10.5px] uppercase text-ink-soft whitespace-nowrap mt-1">
        {status === "coming-soon" ? "Coming soon" : "Read"}
      </span>
    </div>
  );
}

function LevelSection({ level }: { level: Level }) {
  const items = articles.filter((a) => a.level === level && !a.archived);
  const info = levelInfo[level];
  if (items.length === 0) return null;
  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-1">
        <span className={`font-mono text-[10.5px] uppercase tracking-widest rounded-full px-2.5 py-0.5 ${levelStyle[level]}`}>
          {info.label}
        </span>
      </div>
      <p className="text-sm text-ink-soft mb-4 max-w-lg">{info.tagline}</p>
      <div className="flex flex-col gap-2">
        {items.map((a) => <ArticleCard key={a.slug} title={a.title} summary={a.summary} status={a.status} />)}
      </div>
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
        {items.map((a) => <ArticleCard key={a.slug} title={a.title} summary={a.summary} status={a.status} />)}
      </div>
    </div>
  );
}

export default function ArticlesPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-2">Free, always</p>
      <h1 className="font-display text-2xl font-semibold mb-2">Concepts, explained. Research, translated.</h1>
      <p className="text-ink-soft mb-8 max-w-xl">
        Three levels, same ladder as everything else here: <b>Starter</b> assumes nothing,{" "}
        <b>Builder</b> assumes you're making something, <b>Architect</b> assumes you already are one.
      </p>
      <LevelSection level="starter" />
      <LevelSection level="builder" />
      <LevelSection level="architect" />
      <ArchiveSection />
    </main>
  );
}
