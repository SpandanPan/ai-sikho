// One-off run: `npx tsx scripts/generate-product-descriptions.ts`
// Drafts a description for every Interview Pack Starter/Kit and every
// course, via the local Ollama model — Starter Packs and fluency courses
// in plain language, Kits and technical courses in a bit more technical
// language. Prints JSON for review; nothing here writes to the data files
// automatically — same "a human reviews before it ships" standard as the
// other drafting agents. Requires OLLAMA_BASE_URL (see .env.local).
import { generateProductDescription, ContentAgentError } from "../src/lib/contentAgent";
import { interviewPacks } from "../src/data/interviewPacks";
import { courses } from "../src/data/courses";

async function main() {
  const results: Record<string, string> = {};

  for (const pack of interviewPacks) {
    const starter = await generateProductDescription(
      `${pack.title} Starter Pack`,
      `A ₹100 taste of the full kit: 25 practice questions + 1 checklist on ${pack.summary}`,
      "layman",
      "ollama"
    );
    results[`pack:${pack.slug}:starter`] = (starter.content as { description: string }).description;

    const kit = await generateProductDescription(
      `${pack.title} Interview Kit`,
      `${pack.kitContents}, covering: ${pack.summary}`,
      "technical",
      "ollama"
    );
    results[`pack:${pack.slug}:kit`] = (kit.content as { description: string }).description;
  }

  for (const course of courses) {
    const audience = course.category === "fluency" ? "layman" : "technical";
    const result = await generateProductDescription(course.title, course.summary, audience, "ollama");
    results[`course:${course.slug}`] = (result.content as { description: string }).description;
  }

  console.log(JSON.stringify(results, null, 2));
}

main().catch((err) => {
  console.error(err instanceof ContentAgentError ? err.message : err);
  process.exit(1);
});
