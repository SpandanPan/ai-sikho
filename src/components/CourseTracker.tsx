"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function CourseTracker({ slug }: { slug: string }) {
  const { data: session, status } = useSession();
  const signedIn = status === "authenticated";

  const [percent, setPercent] = useState(0);
  const [rated, setRated] = useState<number | null>(null);
  const [summary, setSummary] = useState<{ average: number; count: number }>({ average: 0, count: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/courses/${slug}/ratings`)
      .then((r) => r.json())
      .then(setSummary)
      .catch(() => {});
  }, [slug]);

  useEffect(() => {
    if (!signedIn) return;
    fetch(`/api/courses/${slug}/progress`)
      .then((r) => r.json())
      .then((d) => setPercent(d.percent ?? 0))
      .catch(() => {});
  }, [slug, signedIn]);

  async function updateProgress(next: number) {
    setLoading(true);
    setPercent(next); // optimistic — the bar animates immediately
    try {
      await fetch(`/api/courses/${slug}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ percent: next }),
      });
    } finally {
      setLoading(false);
    }
  }

  async function submitRating(stars: number) {
    setRated(stars);
    await fetch(`/api/courses/${slug}/ratings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating: stars }),
    });
    fetch(`/api/courses/${slug}/ratings`).then((r) => r.json()).then(setSummary);
  }

  return (
    <div className="mt-4 pt-4 border-t border-paper-line">
      <div className="flex items-center justify-between text-xs mb-2">
        <span className="font-mono text-ink-soft">
          {summary.count > 0
            ? `★ ${summary.average.toFixed(1)} (${summary.count} rating${summary.count === 1 ? "" : "s"})`
            : "No ratings yet"}
        </span>
        {signedIn && <span className="font-mono text-ink-soft">{percent}% complete</span>}
      </div>

      {!signedIn ? (
        <a
          href={`/signin?callbackUrl=/courses`}
          className="text-xs text-accent-ink underline"
        >
          Sign in to track your progress and rate this course →
        </a>
      ) : (
        <div>
          <div className="h-2 bg-paper-line rounded-full overflow-hidden">
            <div
              className="h-full bg-accent2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="flex items-center gap-3 mt-3 flex-wrap">
            {percent < 100 ? (
              <div className="flex gap-2">
                <button
                  disabled={loading}
                  onClick={() => updateProgress(Math.min(100, percent + 25))}
                  className="font-mono text-[11px] border border-paper-line rounded px-2.5 py-1.5"
                >
                  +25% progress
                </button>
                <button
                  disabled={loading}
                  onClick={() => updateProgress(100)}
                  className="font-mono text-[11px] bg-ink text-paper rounded px-2.5 py-1.5"
                >
                  Mark complete
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-accent2">Completed 🎉 Rate it:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => submitRating(star)}
                    aria-label={`Rate ${star} stars`}
                    className={`text-lg leading-none ${
                      (rated ?? 0) >= star ? "text-accent" : "text-paper-line"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {signedIn && session?.user?.email && (
        <p className="sr-only">Tracking progress for {session.user.email}</p>
      )}
    </div>
  );
}
