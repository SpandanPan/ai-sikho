"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type Mentor = { id: string; name: string; credentials: string; pricePerSessionInPaise: number };

// Deliberately minimal — this is the "placeholder to add mentors and their
// schedule" you asked for, not a polished admin dashboard. Real enforcement
// is server-side (src/lib/admin.ts, checked in every /api/admin/* route);
// this page just hides itself from non-admins, it isn't the security
// boundary.
export default function AdminMentorsPage() {
  const { data: session, status } = useSession();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [form, setForm] = useState({ name: "", credentials: "", bio: "", pricePerSessionInPaise: "" });
  const [slotForm, setSlotForm] = useState<{ mentorId: string; dates: string }>({ mentorId: "", dates: "" });
  const [message, setMessage] = useState<string | null>(null);

  function loadMentors() {
    fetch("/api/admin/mentors").then((r) => (r.ok ? r.json() : { mentors: [] })).then((d) => setMentors(d.mentors ?? []));
  }

  useEffect(() => {
    if (status === "authenticated") loadMentors();
  }, [status]);

  async function createMentor(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const res = await fetch("/api/admin/mentors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        pricePerSessionInPaise: Math.round(parseFloat(form.pricePerSessionInPaise) * 100),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error ?? "Couldn't create mentor.");
      return;
    }
    setForm({ name: "", credentials: "", bio: "", pricePerSessionInPaise: "" });
    setMessage(`Added ${data.mentor.name}.`);
    loadMentors();
  }

  async function addSlots(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    // One datetime per line, e.g.:
    //   2026-09-15T10:00
    //   2026-09-15T11:00
    const startTimes = slotForm.dates
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const res = await fetch(`/api/admin/mentors/${slotForm.mentorId}/slots`, {
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
    setSlotForm({ ...slotForm, dates: "" });
  }

  if (status === "loading") return null;
  if (status !== "authenticated") {
    return (
      <main className="mx-auto max-w-lg px-5 py-16">
        <a href="/signin?callbackUrl=/admin/mentors" className="text-sm text-accent-ink underline">
          Sign in →
        </a>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-5 py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-2">Admin</p>
      <h1 className="font-display text-2xl font-semibold mb-1">Mentors</h1>
      <p className="text-sm text-ink-soft mb-8">
        Signed in as {session?.user?.email ?? session?.user?.name}. If you see "Admin only" errors
        below, your email isn't in <code className="font-mono text-xs">ADMIN_EMAILS</code>.
      </p>

      <form onSubmit={createMentor} className="border border-paper-line rounded p-5 flex flex-col gap-2.5 mb-6">
        <h2 className="font-semibold text-sm mb-1">Add a mentor</h2>
        <input placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border border-paper-line rounded px-3 py-2 text-sm bg-paper" />
        <input placeholder="Credentials (e.g. Senior AI Engineer, 8 yrs)" required value={form.credentials} onChange={(e) => setForm({ ...form, credentials: e.target.value })} className="border border-paper-line rounded px-3 py-2 text-sm bg-paper" />
        <textarea placeholder="Short bio" required value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="border border-paper-line rounded px-3 py-2 text-sm bg-paper" rows={2} />
        <input placeholder="Price per session (₹)" required type="number" min="1" value={form.pricePerSessionInPaise} onChange={(e) => setForm({ ...form, pricePerSessionInPaise: e.target.value })} className="border border-paper-line rounded px-3 py-2 text-sm bg-paper" />
        <button type="submit" className="font-mono text-xs bg-ink text-paper rounded px-3.5 py-2 self-start">Add mentor</button>
      </form>

      <form onSubmit={addSlots} className="border border-paper-line rounded p-5 flex flex-col gap-2.5 mb-6">
        <h2 className="font-semibold text-sm mb-1">Add availability</h2>
        <select required value={slotForm.mentorId} onChange={(e) => setSlotForm({ ...slotForm, mentorId: e.target.value })} className="border border-paper-line rounded px-3 py-2 text-sm bg-paper">
          <option value="">Select a mentor…</option>
          {mentors.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <textarea
          placeholder={"One slot per line, local time, e.g.:\n2026-09-15T10:00\n2026-09-15T11:00"}
          required
          value={slotForm.dates}
          onChange={(e) => setSlotForm({ ...slotForm, dates: e.target.value })}
          className="border border-paper-line rounded px-3 py-2 text-sm bg-paper font-mono"
          rows={5}
        />
        <button type="submit" className="font-mono text-xs bg-ink text-paper rounded px-3.5 py-2 self-start">Add slots</button>
      </form>

      {message && <p className="text-sm text-accent-ink">{message}</p>}

      <div className="mt-8">
        <h2 className="font-semibold text-sm mb-3">Existing mentors</h2>
        <div className="flex flex-col gap-2">
          {mentors.map((m) => (
            <div key={m.id} className="text-sm border border-paper-line rounded px-3.5 py-2.5">
              {m.name} — ₹{(m.pricePerSessionInPaise / 100).toFixed(0)}/session
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
