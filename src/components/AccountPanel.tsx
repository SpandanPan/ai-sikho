"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AccountPanel() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p className="text-sm text-ink-soft">Checking session…</p>;
  }

  if (session?.user) {
    return (
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm">
          Signed in as <span className="font-semibold">{session.user.email ?? session.user.name}</span>
        </p>
        <button
          onClick={() => signOut()}
          className="font-mono text-xs border border-paper-line rounded px-3.5 py-2"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-ink-soft mb-3">
        Sign in to save quiz history and course purchases across devices.
      </p>
      <button
        onClick={() => signIn("google")}
        className="font-mono text-xs bg-ink text-paper rounded px-3.5 py-2"
      >
        Sign in with Google
      </button>
    </div>
  );
}
