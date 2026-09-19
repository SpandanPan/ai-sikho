import { notFound } from "next/navigation";
import Image from "next/image";
import { articles } from "@/data/articles";
import { blocks as aiVsMlVsDlBlocks, heroImage as aiVsMlVsDlHero, type ArticleBlock } from "@/data/articles/aiVsMlVsDl";
import { blocks as chatbotOrAgentBlocks, heroImage as chatbotOrAgentHero } from "@/data/articles/chatbotOrAgent";

// Content lookup by slug — only articles with status "published" in
// src/data/articles.ts have an entry here. Same pattern as the courses
// lessons lookup in src/app/courses/[slug]/page.tsx.
const articleContent: Record<string, { blocks: ArticleBlock[]; hero: { src: string; alt: string; width: number; height: number } }> = {
  "ai-vs-ml-vs-dl": { blocks: aiVsMlVsDlBlocks, hero: aiVsMlVsDlHero },
  "chatbot-or-agent": { blocks: chatbotOrAgentBlocks, hero: chatbotOrAgentHero },
};

export function generateStaticParams() {
  return Object.keys(articleContent).map((slug) => ({ slug }));
}

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "h2":
      return <h2 className="font-display text-xl font-semibold mt-10 mb-3 text-balance">{block.text}</h2>;
    case "p":
      return <p className="text-[15px] text-ink-soft leading-relaxed mb-4">{block.text}</p>;
    case "callout":
      return (
        <p className="text-base font-semibold text-ink border-l-2 border-accent-ink pl-4 my-6 leading-relaxed">
          {block.text}
        </p>
      );
    case "list":
      return (
        <ul className="mb-4 flex flex-col gap-1.5">
          {block.items.map((item, i) => (
            <li key={i} className="text-[15px] text-ink-soft leading-relaxed flex gap-2">
              <span className="text-accent2 flex-none" aria-hidden>
                •
              </span>
              {item}
            </li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div className="overflow-x-auto mb-4 border border-paper-line rounded">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-paper-line bg-paper-line/20">
                {block.headers.map((h, i) => (
                  <th key={i} className="text-left font-mono text-[10.5px] uppercase tracking-widest text-ink-soft px-3 py-2">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className={i !== block.rows.length - 1 ? "border-b border-paper-line" : ""}>
                  {row.map((cell, j) => (
                    <td key={j} className="px-3 py-2 text-ink-soft">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "diagram":
      return (
        <pre className="mb-4 overflow-x-auto rounded border border-paper-line bg-paper-line/10 p-4 font-mono text-[11.5px] leading-snug text-ink-soft whitespace-pre">
          {block.text}
        </pre>
      );
    case "image":
      return (
        <figure className="my-6">
          <div className="relative w-full rounded-lg overflow-hidden border border-paper-line bg-paper-raised">
            {/* Source images vary in aspect ratio; a fixed-but-generous
                height keeps the layout stable without cropping content. */}
            <Image src={block.src} alt={block.alt} width={1200} height={900} className="w-full h-auto" />
          </div>
          {block.caption && <figcaption className="mt-2 text-xs text-ink-soft text-center italic">{block.caption}</figcaption>}
        </figure>
      );
  }
}

export default function ArticleDetailPage({ params }: { params: { slug: string } }) {
  const meta = articles.find((a) => a.slug === params.slug);
  if (!meta) notFound();

  const content = articleContent[params.slug];

  return (
    <main className="mx-auto max-w-2xl px-5 py-12">
      <a href="/articles" className="font-mono text-[10.5px] text-accent-ink underline inline-flex items-center gap-1 mb-8 hover:text-accent-ink/80 transition-colors">
        ← All articles
      </a>

      <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-2 font-semibold">
        {meta.level === "starter" ? "Starter" : meta.level === "builder" ? "Builder" : "Architect"}
      </p>
      <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-4 text-balance leading-tight">{meta.title}</h1>
      <p className="text-ink-soft text-lg leading-relaxed mb-8">{meta.summary}</p>

      {!content ? (
        <div className="border border-paper-line rounded p-6">
          <p className="text-sm text-ink-soft">
            This piece isn&apos;t written yet — we&apos;d rather say that plainly than link you to nothing.
          </p>
        </div>
      ) : (
        <>
          <figure className="mb-8 -mx-5 sm:mx-0">
            <div className="relative w-full rounded-lg overflow-hidden border border-paper-line">
              <Image src={content.hero.src} alt={content.hero.alt} width={content.hero.width} height={content.hero.height} className="w-full h-auto" priority />
            </div>
          </figure>

          <article>
            {content.blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </article>
        </>
      )}
    </main>
  );
}
