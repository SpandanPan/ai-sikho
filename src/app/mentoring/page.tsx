"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type Mentor = { id: string; name: string; credentials: string; bio: string; photoUrl: string | null; pricePerSessionInPaise: number };
type Slot = { id: string; startTime: string; durationMinutes: number };

function formatPrice(paise: number) {
  return `₹${(paise / 100).toFixed(0)}`;
}

export default function MentoringPage() {
  const { status } = useSession();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [selected, setSelected] = useState<Mentor | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/mentors").then((r) => r.json()).then((d) => setMentors(d.mentors ?? []));
  }, []);

  function openMentor(m: Mentor) {
    setSelected(m);
    setMessage(null);
    fetch(`/api/mentors/${m.id}/slots`).then((r) => r.json()).then((d) => setSlots(d.slots ?? []));
  }

  async function book(slotId: string) {
    if (!selected) return;
    setMessage(null);
    const res = await fetch(`/api/mentors/${selected.id}/book`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slotId }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error ?? "Couldn't book that slot.");
      return;
    }
    setMessage("Slot reserved — payment collection isn't wired up yet, so this is held as pending.");
    setSlots((prev) => prev.filter((s) => s.id !== slotId));
  }

  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-2">1:1 Mentoring</p>
      <h1 className="font-display text-2xl font-semibold mb-2">
        Book time with someone who's already done it.
      </h1>
      <p className="text-ink-soft mb-8 max-w-xl">
        Career guidance for early-stage AI/GenAI engineers. Slots open up to 15 days ahead —
        mentors and availability are added by hand, so the list grows as they're onboarded.
      </p>

      {mentors.length === 0 && (
        <p className="text-sm text-ink-soft border border-paper-line rounded p-5">
          No mentors listed yet — check back soon.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {mentors.map((m) => (
          <div key={m.id} className="border border-paper-line rounded p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h2 className="font-semibold">{m.name}</h2>
                <p className="text-xs text-accent-ink font-mono mt-0.5">{m.credentials}</p>
                <p className="text-sm text-ink-soft mt-2 max-w-lg">{m.bio}</p>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm text-accent-ink">{formatPrice(m.pricePerSessionInPaise)}</div>
                <button
                  onClick={() => openMentor(m)}
                  className="mt-2 font-mono text-[11px] bg-ink text-paper rounded px-3 py-1.5"
                >
                  See availability
                </button>
              </div>
            </div>

            {selected?.id === m.id && (
              <div className="mt-4 pt-4 border-t border-paper-line">
                {status !== "authenticated" ? (
                  <a href="/signin?callbackUrl=/mentoring" className="text-xs text-accent-ink underline">
                    Sign in to book a slot →
                  </a>
                ) : slots.length === 0 ? (
                  <p className="text-xs text-ink-soft">No open slots in the next 15 days.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {slots.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => book(s.id)}
                        className="font-mono text-[11px] border border-paper-line rounded px-2.5 py-1.5 hover:border-accent"
                      >
                        {new Date(s.startTime).toLocaleString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </button>
                    ))}
                  </div>
                )}
                {message && <p className="text-xs mt-3 text-accent-ink">{message}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
