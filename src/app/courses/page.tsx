import { courses, formatPrice } from "@/data/courses";
import RagDemo from "@/components/RagDemo";
import CourseTracker from "@/components/CourseTracker";
import AddToCartButton from "@/components/AddToCartButton";

export default function CoursesPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-2">Short courses</p>
      <h1 className="font-display text-2xl font-semibold mb-2">One topic, one sitting, no fluff.</h1>
      <p className="text-ink-soft mb-8 max-w-xl">
        The foundations are free. The parts that actually differentiate an AI Engineer — RAG,
        graphs, and production observability — are nominally priced.
      </p>

      <div className="flex flex-col gap-3">
        {courses.map((c) => (
          <div key={c.slug} className="border border-paper-line rounded p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h2 className="font-semibold flex items-center gap-1.5">
                  {c.title}
                  {c.priceInPaise > 0 && (
                    <span title="Paid" aria-label="Paid">
                      🔒
                    </span>
                  )}
                </h2>
                <p className="text-sm text-ink-soft mt-1 max-w-lg">{c.summary}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span
                  className={`font-mono text-sm whitespace-nowrap ${
                    c.priceInPaise === 0 ? "text-accent2" : "text-accent-ink"
                  }`}
                >
                  {formatPrice(c.priceInPaise)}
                </span>
                {c.priceInPaise > 0 && (
                  <AddToCartButton
                    item={{ key: `course:${c.slug}`, type: "course", slug: c.slug, label: c.title, amountInPaise: c.priceInPaise }}
                    className="font-mono text-[10.5px] border border-paper-line rounded px-2.5 py-1.5"
                  />
                )}
              </div>
            </div>
            {c.hasDemo && (
              <div className="mt-4">
                <RagDemo />
              </div>
            )}
            <CourseTracker slug={c.slug} />
          </div>
        ))}
      </div>
    </main>
  );
}
