"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/";

  const [step, setStep] = useState<"identifier" | "code">("identifier");
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function requestCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Try again.");
        return;
      }
      setDevCode(data.devCode ?? null);
      setStep("code");
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await signIn("otp", { identifier, code, redirect: false });
      if (res?.error) {
        setError("That code didn't match, or it's expired. Request a new one.");
        return;
      }
      router.push(callbackUrl);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-2">Sign in</p>
      <h1 className="font-display text-2xl font-semibold mb-6">
        {step === "identifier" ? "Email or phone number" : "Enter the code"}
      </h1>

      {step === "identifier" && (
        <form onSubmit={requestCode} className="flex flex-col gap-3">
          <input
            type="text"
            required
            autoFocus
            placeholder="you@example.com or +91 98765 43210"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="border border-paper-line rounded px-3.5 py-2.5 bg-paper text-sm"
          />
          {error && <p className="text-sm text-rust">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="font-mono text-sm bg-ink text-paper rounded px-4 py-2.5 disabled:opacity-60"
          >
            {loading ? "Sending…" : "Send code"}
          </button>
        </form>
      )}

      {step === "code" && (
        <form onSubmit={verifyCode} className="flex flex-col gap-3">
          <p className="text-sm text-ink-soft">
            We sent a 6-digit code to <span className="text-ink font-semibold">{identifier}</span>.
          </p>
          {devCode && (
            <p className="text-xs font-mono text-accent-ink bg-paper-raised border border-paper-line rounded px-3 py-2">
              Dev mode — no SMS/email provider configured yet, so here&apos;s the code: {devCode}
            </p>
          )}
          <input
            type="text"
            inputMode="numeric"
            required
            autoFocus
            maxLength={6}
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="border border-paper-line rounded px-3.5 py-2.5 bg-paper text-sm tracking-widest font-mono"
          />
          {error && <p className="text-sm text-rust">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="font-mono text-sm bg-ink text-paper rounded px-4 py-2.5 disabled:opacity-60"
          >
            {loading ? "Verifying…" : "Verify and sign in"}
          </button>
          <button
            type="button"
            onClick={() => setStep("identifier")}
            className="font-mono text-xs text-ink-soft underline self-start"
          >
            Use a different email or phone
          </button>
        </form>
      )}

      <div className="mt-8 pt-6 border-t border-paper-line">
        <button
          onClick={() => signIn("google", { callbackUrl })}
          className="w-full font-mono text-sm border border-paper-line rounded px-4 py-2.5"
        >
          Continue with Google instead
        </button>
      </div>
    </>
  );
}
