"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import EditableName from "@/components/EditableName";
import RevisionBoard from "@/components/RevisionBoard";

type Profile = {
  streak: { current: number; longest: number };
  courses: { slug: string; title: string; percent: number; status: "not-started" | "in-progress" | "completed" }[];
  quizAttempts: { score: number; total: number; createdAt: string }[];
  recentlyViewed: { path: string; lastVisited: string }[];
  isMentor: boolean;
  mentorBookings: { mentorName: string; startTime: string; meetingJoinUrl: string | null }[];
};

const STATUS_LABEL: Record<Profile["courses"][number]["status"], string> = {
  "not-started": "Not started",
  "in-progress": "In progress",
  completed: "Completed",
};

export default function ProfilePage() {
  const { status } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/profile").then((r) => (r.ok ? r.json() : null)).then(setProfile);
  }, [status]);

  if (status === "loading") return null;
  if (status !== "authenticated") {
    return (
      <main className="mx-auto max-w-lg px-5 py-16">
        <a href="/signin?callbackUrl=/profile" className="text-sm text-accent-ink underline">Sign in →</a>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-5 py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-1">Your profile</p>
      <div className="mb-2">
        <EditableName />
      </div>
      <p className="text-xs text-ink-soft mb-8 flex flex-wrap gap-x-4 gap-y-1">
        <a href="/settings" className="text-accent-ink underline">Account, devices &amp; theme →</a>
        {profile?.isMentor && (
          <a href="/mentor" className="text-accent-ink underline">Mentor dashboard →</a>
        )}
      </p>

      {!profile ? (
        <p className="text-sm text-ink-soft">Loading…</p>
      ) : (
        <div className="flex flex-col gap-8">
          <section className="border border-accent rounded p-5 flex items-center gap-6">
            <div>
              <div className="font-display text-3xl text-accent-ink">{profile.streak.current}</div>
              <p className="font-mono text-[10.5px] uppercase text-ink-soft">day streak</p>
            </div>
            <div className="text-sm text-ink-soft">
              {profile.streak.current > 0
                ? "Keep it going — visit again tomorrow to extend it."
                : "No active streak — visit two days in a row to start one."}
              <br />
              Longest so far: <b className="text-ink">{profile.streak.longest}</b> day{profile.streak.longest === 1 ? "" : "s"}.
            </div>
          </section>

          {profile.mentorBookings.length > 0 && (
            <section>
              <h2 className="font-semibold text-sm mb-3">Upcoming mentoring session{profile.mentorBookings.length > 1 ? "s" : ""}</h2>
              <div className="flex flex-col gap-2">
                {profile.mentorBookings.map((b, i) => (
                  <div key={i} className="flex items-center justify-between border border-accent rounded px-4 py-3 flex-wrap gap-2">
                    <div>
                      <p className="text-sm font-semibold">{b.mentorName}</p>
                      <p className="text-xs text-ink-soft">
                        {new Date(b.startTime).toLocaleString(undefined, {
                          weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {b.meetingJoinUrl ? (
                      <a href={b.meetingJoinUrl} target="_blank" rel="noreferrer" className="font-mono text-xs bg-ink text-paper rounded px-3 py-1.5">
                        Join call →
                      </a>
                    ) : (
                      <span className="font-mono text-[10.5px] text-ink-soft uppercase">Link pending</span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="font-semibold text-sm mb-3">Courses</h2>
            <div className="flex flex-col gap-2">
              {profile.courses.map((c) => (
                <div key={c.slug} className="flex items-center justify-between border border-paper-line rounded px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold">{c.title}</p>
                    <p className="text-xs text-ink-soft">{STATUS_LABEL[c.status]}</p>
                  </div>
                  <div className="w-28 h-2 bg-paper-line rounded-full overflow-hidden">
                    <div className="h-full bg-accent2 rounded-full transition-all" style={{ width: `${c.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-semibold text-sm mb-3">Quiz history</h2>
            {profile.quizAttempts.length === 0 ? (
              <p className="text-sm text-ink-soft">
                No attempts yet — <a href="/quiz" className="text-accent-ink underline">take the quiz →</a>
              </p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {profile.quizAttempts.map((a, i) => (
                  <div key={i} className="flex justify-between text-sm border-t border-paper-line py-1.5 first:border-t-0">
                    <span>{new Date(a.createdAt).toLocaleDateString()}</span>
                    <span className="font-mono">{a.score}/{a.total}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="font-semibold text-sm mb-3">Recently viewed</h2>
            {profile.recentlyViewed.length === 0 ? (
              <p className="text-sm text-ink-soft">Nothing tracked yet.</p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {profile.recentlyViewed.map((v) => (
                  <a key={v.path} href={v.path} className="flex justify-between text-sm border-t border-paper-line py-1.5 first:border-t-0 hover:text-accent-ink">
                    <span className="font-mono">{v.path}</span>
                    <span className="text-xs text-ink-soft">{new Date(v.lastVisited).toLocaleDateString()}</span>
                  </a>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="font-semibold text-sm mb-3">Revision — notes &amp; bookmarks</h2>
            <RevisionBoard />
          </section>
        </div>
      )}
    </main>
  );
}
