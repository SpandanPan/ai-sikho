"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function EditableName() {
  const { data: session, update } = useSession();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(session?.user?.name ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setSaving(false);
    if (!res.ok) {
      setError((await res.json()).error ?? "Couldn't save.");
      return;
    }
    await update(); // refresh the session's cached name
    setEditing(false);
  }

  const displayName = session?.user?.name ?? session?.user?.email ?? "";

  if (!editing) {
    return (
      <div className="flex items-center gap-3">
        <h1 className="font-display text-2xl font-semibold">Welcome, {displayName}</h1>
        <button
          onClick={() => {
            setName(session?.user?.name ?? "");
            setEditing(true);
          }}
          className="font-mono text-[10.5px] text-ink-soft hover:text-accent-ink underline"
        >
          edit name
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={save} className="flex items-center gap-2 flex-wrap">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus
        className="border border-paper-line rounded px-3 py-1.5 text-lg bg-paper font-display"
      />
      <button type="submit" disabled={saving} className="font-mono text-xs bg-ink text-paper rounded px-3 py-1.5">
        Save
      </button>
      <button type="button" onClick={() => setEditing(false)} className="font-mono text-xs text-ink-soft">
        Cancel
      </button>
      {error && <p className="text-xs text-rust w-full">{error}</p>}
    </form>
  );
}
