"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";

export default function DeleteAccount() {
  const { status } = useSession();
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (status !== "authenticated") {
    return <p className="text-sm text-ink-soft">Sign in to manage account deletion.</p>;
  }

  async function deleteAccount() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/account", { method: "DELETE" });
    if (!res.ok) {
      setError("Couldn't delete your account — try again or reach out via /help.");
      setLoading(false);
      return;
    }
    await signOut({ callbackUrl: "/" });
  }

  return (
    <div>
      <p className="text-sm text-ink-soft mb-3">
        Deletes your account and everything tied to it — purchases, course progress, ratings,
        mentor bookings, sessions. This can&apos;t be undone. See{" "}
        <a href="/privacy" className="text-accent-ink underline">Privacy Policy</a> for exactly
        what is and isn&apos;t removed.
      </p>
      <div className="flex gap-2 items-center flex-wrap">
        <input
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="Type DELETE to confirm"
          className="border border-rust rounded px-3 py-2 text-sm bg-paper"
        />
        <button
          disabled={confirmText !== "DELETE" || loading}
          onClick={deleteAccount}
          className="font-mono text-xs bg-rust text-paper rounded px-3.5 py-2 disabled:opacity-40"
        >
          {loading ? "Deleting…" : "Delete my account"}
        </button>
      </div>
      {error && <p className="text-xs text-rust mt-2">{error}</p>}
    </div>
  );
}
