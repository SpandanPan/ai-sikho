import { prisma } from "./prisma";

const SOURCES: [string, string][] = [
  ["TechCrunch AI", "https://techcrunch.com/category/artificial-intelligence/feed/"],
  ["MIT Technology Review", "https://www.technologyreview.com/feed/"],
  ["Ars Technica", "https://feeds.arstechnica.com/arstechnica/index"],
  ["Google AI Blog", "https://blog.google/technology/ai/rss/"],
];

export function stripHtml(text: string): string {
  return text.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

export function extractTag(block: string, tag: string): string {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  if (!match) return "";
  return match[1].replace(/^<!\[CDATA\[|\]\]>$/g, "").trim();
}

// Copyright safety, deliberately: we only ever read the SOURCE'S OWN public
// RSS feed (feeds they publish specifically to be syndicated) and keep just
// the title, a short excerpt of their own description field (hard-capped
// well below a full article), and a link back to them. We never fetch the
// article page itself or store full body text. This is the same pattern
// Google News / Apple News / Feedly use — attributed headline + snippet +
// outbound link, not republishing. Don't change this to scrape full articles.
export function parseItems(xml: string, source: string, limit = 3) {
  const items = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];
  return items.slice(0, limit).map((block) => ({
    source,
    title: stripHtml(extractTag(block, "title")),
    summary: stripHtml(extractTag(block, "description")).slice(0, 180),
    link: extractTag(block, "link"),
    publishedAt: new Date(extractTag(block, "pubDate") || Date.now()),
  }));
}

// Shared by scripts/fetch-news.ts (manual/CI run) and the Vercel Cron route,
// so there is exactly one implementation of "how we pull AI news."
export async function fetchAndStoreNews() {
  const all: ReturnType<typeof parseItems>[number][] = [];

  for (const [name, url] of SOURCES) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; AIPulseBot/0.1)" } });
      const xml = await res.text();
      all.push(...parseItems(xml, name));
    } catch (err) {
      console.error(`FAIL ${name}:`, err);
    }
  }

  let upserted = 0;
  for (const item of all) {
    if (!item.link) continue;
    await prisma.newsItem.upsert({
      where: { link: item.link },
      update: { title: item.title, summary: item.summary, publishedAt: item.publishedAt },
      create: item,
    });
    upserted++;
  }

  return { fetched: all.length, upserted };
}
