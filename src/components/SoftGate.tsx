"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

// Wraps exploratory/browsing content (news, cost comparisons, free-tool
// listings) that's free to a point, then nudges sign-in — not a hard wall.
// The money-making pitch (hero, Interview Pack) is never wrapped in this;
// only content whose job is engagement, not conversion, is gated.
//
// The timer is per page-load, not cumulative across visits — resets on
// refresh. A signed-in visitor never sees the gate at all.
export default function SoftGate({ children, seconds = 150 }: { children: React.ReactNode; seconds?: number }) {
  const { status } = useSession();
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (status === "authenticated") return;
    const timer = setTimeout(() => setExpired(true), seconds * 1000);
    return () => clearTimeout(timer);
  }, [status, seconds]);

  if (status === "authenticated" || !expired) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div aria-hidden className="pointer-events-none select-none blur-sm opacity-40">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center px-5">
        <div className="bg-paper border border-accent rounded-lg p-6 text-center max-w-xs shadow-lg">
          <p className="font-semibold text-sm mb-1">You've been exploring for a couple of minutes.</p>
          <p className="text-xs text-ink-soft mb-4">Sign in — 10 seconds — to keep reading.</p>
          <a
            href="/signin?callbackUrl=/"
            className="inline-block font-mono text-xs bg-ink text-paper rounded px-4 py-2"
          >
            Sign in →
          </a>
        </div>
      </div>
    </div>
  );
}
