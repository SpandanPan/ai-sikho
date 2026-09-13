import { Suspense } from "react";
import SignInForm from "./SignInForm";

export default function SignInPage() {
  return (
    <main className="mx-auto max-w-sm px-5 py-16">
      <Suspense fallback={<p className="text-sm text-ink-soft">Loading…</p>}>
        <SignInForm />
      </Suspense>
    </main>
  );
}
