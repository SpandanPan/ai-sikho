"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type Mentor = {
  id: string;
  name: string;
  credentials: string;
  bio: string;
  photoUrl: string | null;
  pricePerSessionInPaise: number;
  personalMeetingUrl: string | null;
};
type Slot = { id: string; startTime: string; durationMinutes: number; booked: boolean };
type Booking = {
  id: string;
  startTime: string;
  durationMinutes: number;
  customerName: string;
  meetingHostUrl: string | null;
  meetingProvider: string | null;
};

// Self-service dashboard for an onboarded mentor: see and manage your own
// availability, set your own price and personal meeting link, see who's
// booked and how to join the call. Onboarding itself (creating the Mentor
// row in the first place) stays admin-only — see /api/admin/mentors — this
// page is everything a mentor does after that.
export default function MentorDashboardPage() {
  const { status } = useSession();
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [forbidden, setForbidden] = useState(false);
  const [profileForm, setProfileForm] = useState<{ credentials: string; bio: string; price: string; personalMeetingUrl: string } | null>(null);
  const [slotDates, setSlotDates] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  function load() {
    fetch("/api/mentor/me").then(async (r) => {
      if (r.status === 403) {
        setForbidden(true);
        return;
      }
      const d = await r.json();
      setMentor(d.mentor);
      setSlots(d.slots ?? []);
      setBookings(d.bookings ?? []);
      setProfileForm({
        credentials: d.mentor.credentials,
        bio: d.mentor.bio,
        price: (d.mentor.pricePerSessionInPaise / 100).toString(),
        personalMeetingUrl: d.mentor.personalMeetingUrl ?? "",
      });
    });
  }

  useEffect(() => {
    if (status === "authenticated") load();
  }, [status]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!profileForm) return;
    setMessage(null);
    const res = await fetch("/api/mentor/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        credentials: profileForm.credentials,
        bio: profileForm.bio,
        pricePerSessionInPaise: Math.round(parseFloat(profileForm.price) * 100),
        personalMeetingUrl: profileForm.personalMeetingUrl,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error ?? "Couldn't save.");
      return;
    }
    setMessage("Saved.");
    load();
  }

  async function addSlots(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const startTimes = slotDates.split("\n").map((l) => l.trim()).filter(Boolean);
    const res = await fetch("/api/mentor/slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slots: startTimes.map((startTime) => ({ startTime })) }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error ?? "Couldn't add slots.");
      return;
    }
    setMessage(`Added ${data.created} slot(s).`);
    setSlotDates("");
    load();
  }

  async function deleteSlot(id: string) {
    setMessage(null);
    const res = await fetch(`/api/mentor/slots/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error ?? "Couldn't remove that slot.");
      return;
    }
    setSlots((prev) => prev.filter((s) => s.id !== id));
  }

  if (status === "loading") return null;
  if (status !== "authenticated") {
    return (
      <main className="mx-auto max-w-lg px-5 py-16">
        <a href="/signin?callbackUrl=/mentor" className="text-sm text-accent-ink underline">Sign in →</a>
      </main>
    );
  }
  if (forbidden) {
    return (
      <main className="mx-auto max-w-lg px-5 py-16">
        <p className="text-sm text-ink-soft">
          This account isn&apos;t linked to a mentor profile. If you&apos;re expecting mentor access,
          check the email you signed in with matches the one you were onboarded under.
        </p>
      </main>
    );
  }
  if (!mentor || !profileForm) return null;

  return (
    <main className="mx-auto max-w-2xl px-5 py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-1">Mentor dashboard</p>
      <h1 className="font-display text-2xl font-semibold mb-8">{mentor.name}</h1>

      <div className="flex flex-col gap-8">
        <section>
          <h2 className="font-semibold text-sm mb-3">Upcoming bookings</h2>
          {bookings.length === 0 ? (
            <p className="text-sm text-ink-soft">No paid bookings yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {bookings.map((b) => (
                <div key={b.id} className="flex items-center justify-between border border-paper-line rounded px-4 py-3 flex-wrap gap-2">
                  <div>
                    <p className="text-sm font-semibold">{b.customerName}</p>
                    <p className="text-xs text-ink-soft">
                      {new Date(b.startTime).toLocaleString(undefined, {
                        weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
                      })}{" "}
                      · {b.durationMinutes} min
                    </p>
                  </div>
                  {b.meetingHostUrl ? (
                    <a href={b.meetingHostUrl} target="_blank" rel="noreferrer" className="font-mono text-xs bg-ink text-paper rounded px-3 py-1.5">
                      Start call →
                    </a>
                  ) : (
                    <span className="font-mono text-[10.5px] text-ink-soft uppercase">Link pending</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="font-semibold text-sm mb-3">Your availability</h2>
          {slots.length === 0 ? (
            <p className="text-sm text-ink-soft mb-3">No open slots in the next 15 days.</p>
          ) : (
            <div className="flex flex-col gap-1.5 mb-4">
              {slots.map((s) => (
                <div key={s.id} className="flex items-center justify-between text-sm border-t border-paper-line py-1.5 first:border-t-0">
                  <span>
                    {new Date(s.startTime).toLocaleString(undefined, {
                      weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
                    })}{" "}
                    ({s.durationMinutes} min)
                  </span>
                  {s.booked ? (
                    <span className="font-mono text-[10.5px] text-accent2 uppercase">Booked</span>
                  ) : (
                    <button onClick={() => deleteSlot(s.id)} className="font-mono text-[10.5px] text-rust underline">
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
          <form onSubmit={addSlots} className="border border-paper-line rounded p-4 flex flex-col gap-2.5">
            <p className="text-xs text-ink-soft">Add open slots, one local date/time per line, within the next 15 days.</p>
            <textarea
              placeholder={"2026-10-01T10:00\n2026-10-01T11:00"}
              value={slotDates}
              onChange={(e) => setSlotDates(e.target.value)}
              className="border border-paper-line rounded px-3 py-2 text-sm bg-paper font-mono"
              rows={4}
              required
            />
            <button type="submit" className="font-mono text-xs bg-ink text-paper rounded px-3.5 py-2 self-start">Add slots</button>
          </form>
        </section>

        <section>
          <h2 className="font-semibold text-sm mb-3">Your profile &amp; charges</h2>
          <form onSubmit={saveProfile} className="border border-paper-line rounded p-4 flex flex-col gap-2.5">
            <label className="text-xs text-ink-soft">
              Credentials
              <input
                value={profileForm.credentials}
                onChange={(e) => setProfileForm({ ...profileForm, credentials: e.target.value })}
                className="mt-1 w-full border border-paper-line rounded px-3 py-2 text-sm bg-paper"
              />
            </label>
            <label className="text-xs text-ink-soft">
              Bio
              <textarea
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                className="mt-1 w-full border border-paper-line rounded px-3 py-2 text-sm bg-paper"
                rows={2}
              />
            </label>
            <label className="text-xs text-ink-soft">
              Price per session (₹)
              <input
                type="number"
                min="1"
                value={profileForm.price}
                onChange={(e) => setProfileForm({ ...profileForm, price: e.target.value })}
                className="mt-1 w-full border border-paper-line rounded px-3 py-2 text-sm bg-paper"
              />
            </label>
            <label className="text-xs text-ink-soft">
              Personal meeting link (Zoom/Google Meet/Teams) — used for calls unless the platform generates a unique link automatically
              <input
                value={profileForm.personalMeetingUrl}
                onChange={(e) => setProfileForm({ ...profileForm, personalMeetingUrl: e.target.value })}
                placeholder="https://meet.google.com/xxx-xxxx-xxx"
                className="mt-1 w-full border border-paper-line rounded px-3 py-2 text-sm bg-paper"
              />
            </label>
            <button type="submit" className="font-mono text-xs bg-ink text-paper rounded px-3.5 py-2 self-start">Save</button>
          </form>
        </section>

        {message && <p className="text-sm text-accent-ink">{message}</p>}
      </div>
    </main>
  );
}
