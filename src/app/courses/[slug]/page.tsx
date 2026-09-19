import { notFound } from "next/navigation";
import { courses } from "@/data/courses";
import { lessons as fluencyLessons } from "@/data/lessons/aiFluencyBasics";
import { lesson as toolsLesson } from "@/data/lessons/aiToolsToTry";
import CourseTracker from "@/components/CourseTracker";
import CrossSell from "@/components/CrossSell";
import AiDialogue from "@/components/AiDialogue";
import AiFluencyCheatSheet from "@/components/AiFluencyCheatSheet";
import GoDeeper from "@/components/GoDeeper";
import {
  NestedLayersDiagram,
  AttentionSentenceDemo,
  TransformerCompareDiagram,
  ConfidenceComparisonDiagram,
} from "@/components/PriorityVisuals";
import {
  IngredientsConvergeChart,
  TimelinePathVisual,
  NextWordPredictor,
  BeforeAfterCards,
  MemoryChatTimeline,
  TermFlipCards,
  DecisionMap,
} from "@/components/PriorityVisualsPhase2";

// Each course's content lives in its own file under src/data/lessons/ —
// merged here into one lookup keyed by course slug, same shape either way.
const lessons = { ...fluencyLessons, [toolsLesson.slug]: toolsLesson };

// A handful of paragraphs are written as "TEXT EXAMPLE — ..." / "IMAGE
// EXAMPLE — ..." so beginners can visually scan for the concrete example
// inside a section instead of reading it as one more undifferentiated
// paragraph. This just pulls that label out to render it as a tag.
const EXAMPLE_PREFIX = /^(TEXT EXAMPLE|IMAGE EXAMPLE) — ([\s\S]*)$/;

export function generateStaticParams() {
  return Object.keys(lessons).map((slug) => ({ slug }));
}

export default function CourseLessonPage({ params }: { params: { slug: string } }) {
  const course = courses.find((c) => c.slug === params.slug);
  if (!course) notFound();

  const lesson = lessons[params.slug];

  return (
    <main className="min-h-screen bg-gradient-to-b from-paper via-paper to-paper-line/5">
      <div className="mx-auto max-w-3xl px-5 py-12">
        <a href="/courses" className="font-mono text-[10.5px] text-accent-ink underline inline-flex items-center gap-1 mb-8 hover:text-accent-ink/80 transition-colors">
          ← All courses
        </a>

        {/* Header section with visual interest */}
        <div className="mb-12 relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-accent-ink/5 via-accent2/5 to-transparent rounded-2xl blur-xl" />
          <div className="relative">
            <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-2 font-semibold">
              {lesson ? `${lesson.estMinutes} min read` : course.category === "fluency" ? "AI Fluency" : "For AI/GenAI Engineers"}
            </p>
            <h1 className="font-display text-4xl font-semibold mb-4 text-balance leading-tight">{course.title}</h1>
            <p className="text-ink-soft text-lg max-w-2xl leading-relaxed">{course.summary}</p>
          </div>
        </div>

        {!lesson ? (
        <div className="border border-paper-line rounded p-6">
          <p className="text-sm text-ink-soft mb-3">
            We haven&apos;t published the actual lesson content for this course yet — right now this
            page is a placeholder. We&apos;d rather say that plainly than have you pay for something
            that isn&apos;t here.
          </p>
          <p className="text-sm text-ink-soft">{course.description}</p>
          <a href="/courses" className="font-mono text-[10.5px] text-accent-ink underline mt-4 inline-block">
            ← Back to courses
          </a>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {lesson.sections.map((s, i) => (
            <section key={s.heading} className="border-b border-paper-line pb-8 last:border-b-0">
              <p className="font-mono text-[10.5px] text-accent2 mb-1">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h2 className="font-display text-lg font-semibold mb-3">
                {s.url ? (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-ink underline decoration-paper-line hover:decoration-accent-ink"
                  >
                    {s.heading} ↗
                  </a>
                ) : (
                  s.heading
                )}
              </h2>
              {s.component === "dialogue" && (
                <div className="mb-6">
                  <AiDialogue />
                </div>
              )}
              {s.component === "ai-nesting" && (
                <div className="mb-6">
                  <NestedLayersDiagram />
                </div>
              )}
              {s.component === "attention" && (
                <div className="mb-6">
                  <AttentionSentenceDemo />
                </div>
              )}
              {s.component === "data-growth" && (
                <div className="mb-6">
                  <IngredientsConvergeChart />
                </div>
              )}
              {s.component === "hallucination" && (
                <div className="mb-6">
                  <ConfidenceComparisonDiagram />
                </div>
              )}
              {s.component === "transformer" && (
                <div className="mb-6">
                  <TransformerCompareDiagram />
                </div>
              )}
              {s.component === "timeline" && (
                <div className="mb-6">
                  <TimelinePathVisual />
                </div>
              )}
              {s.component === "predictor" && (
                <div className="mb-6">
                  <NextWordPredictor />
                </div>
              )}
              {s.component === "before-after" && (
                <div className="mb-6">
                  <BeforeAfterCards />
                </div>
              )}
              {s.component === "memory-chat" && (
                <div className="mb-6">
                  <MemoryChatTimeline />
                </div>
              )}
              {s.component === "terms-flip" && (
                <div className="mb-6">
                  <TermFlipCards />
                </div>
              )}
              {s.component === "decision-map" && (
                <div className="mb-6">
                  <DecisionMap />
                </div>
              )}
              {s.component === "cheatsheet" && (
                <div className="mb-6">
                  <AiFluencyCheatSheet />
                </div>
              )}
              <div className="flex flex-col gap-3">
                {s.body.map((p, j) => {
                  const match = p.match(EXAMPLE_PREFIX);
                  if (match) {
                    const [, label, rest] = match;
                    return (
                      <p key={j} className="text-sm text-ink-soft leading-relaxed border-l-2 border-accent2/50 pl-3">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-accent2 mr-1.5">
                          {label}
                        </span>
                        {rest}
                      </p>
                    );
                  }
                  return (
                    <p key={j} className="text-sm text-ink-soft leading-relaxed">
                      {p}
                    </p>
                  );
                })}
              </div>
              {s.deeper && s.deeper.length > 0 && <GoDeeper paragraphs={s.deeper} />}
              {(s.myth || s.fact) && (
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {s.myth && (
                    <div className="border border-rust/40 rounded p-3">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-rust mb-1">Myth</p>
                      <p className="text-xs text-ink-soft">{s.myth}</p>
                    </div>
                  )}
                  {s.fact && (
                    <div className="border border-accent2/40 rounded p-3">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-accent2 mb-1">Fact</p>
                      <p className="text-xs text-ink-soft">{s.fact}</p>
                    </div>
                  )}
                </div>
              )}
              {s.tryIt && (
                <div className="mt-4 border-l-2 border-accent pl-3">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-accent-ink mb-1">Try it yourself</p>
                  <p className="text-xs text-ink-soft">{s.tryIt}</p>
                </div>
              )}
            </section>
          ))}
        </div>
      )}

        <div className="mt-8 pt-8 border-t border-paper-line">
          <CourseTracker slug={course.slug} />
        </div>

        <div className="mt-12 pt-8 border-t border-paper-line">
          <CrossSell excludeKey={`course:${course.slug}`} />
        </div>
      </div>
    </main>
  );
}
