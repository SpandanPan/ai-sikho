import { describe, expect, it } from "vitest";
import { stripHtml, extractTag, parseItems } from "./fetchNews";

describe("stripHtml", () => {
  it("removes tags and collapses whitespace", () => {
    expect(stripHtml("<p>Hello   <b>world</b></p>")).toBe("Hello world");
  });

  it("returns an empty string unchanged", () => {
    expect(stripHtml("")).toBe("");
  });
});

describe("extractTag", () => {
  it("extracts the content of a simple tag", () => {
    expect(extractTag("<title>Hello</title>", "title")).toBe("Hello");
  });

  it("unwraps a CDATA section", () => {
    expect(extractTag("<title><![CDATA[Hello & Goodbye]]></title>", "title")).toBe("Hello & Goodbye");
  });

  it("returns an empty string when the tag is missing", () => {
    expect(extractTag("<title>Hello</title>", "link")).toBe("");
  });
});

describe("parseItems", () => {
  const xml = `
    <rss><channel>
      <item>
        <title>First Story</title>
        <link>https://example.com/1</link>
        <description>Short summary one.</description>
        <pubDate>Mon, 01 Sep 2026 00:00:00 GMT</pubDate>
      </item>
      <item>
        <title>Second Story</title>
        <link>https://example.com/2</link>
        <description>Short summary two.</description>
        <pubDate>Tue, 02 Sep 2026 00:00:00 GMT</pubDate>
      </item>
      <item>
        <title>Third Story (over limit)</title>
        <link>https://example.com/3</link>
        <description>Should be excluded by the limit.</description>
      </item>
    </channel></rss>
  `;

  it("parses title, link, summary, and source for each item", () => {
    const items = parseItems(xml, "Example Feed", 10);
    expect(items).toHaveLength(3);
    expect(items[0]).toMatchObject({
      source: "Example Feed",
      title: "First Story",
      link: "https://example.com/1",
      summary: "Short summary one.",
    });
  });

  it("respects the limit parameter, never returning more than asked", () => {
    const items = parseItems(xml, "Example Feed", 2);
    expect(items).toHaveLength(2);
    expect(items.map((i) => i.title)).toEqual(["First Story", "Second Story"]);
  });

  it("truncates an overly long description to a short excerpt", () => {
    const longDesc = "x".repeat(500);
    const singleItemXml = `<item><title>T</title><link>https://example.com/x</link><description>${longDesc}</description></item>`;
    const [item] = parseItems(singleItemXml, "Example Feed", 1);
    // Copyright safety: never store more than a short excerpt of another
    // publisher's own description field.
    expect(item.summary.length).toBeLessThanOrEqual(180);
  });
});
