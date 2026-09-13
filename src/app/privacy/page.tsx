export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-12 text-sm leading-relaxed">
      <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-2">Privacy Policy</p>
      <h1 className="font-display text-2xl font-semibold mb-1">What we collect, and why.</h1>
      <p className="text-ink-soft mb-8">Last updated: draft, not yet reviewed by a lawyer — see the note at the bottom.</p>

      <div className="flex flex-col gap-6">
        <section>
          <h2 className="font-semibold mb-2">What we collect</h2>
          <ul className="list-disc pl-5 text-ink-soft space-y-1">
            <li>Your email address or phone number, when you sign in — this is how your account is identified. We don&apos;t collect a password; sign-in is by one-time code sent to that email or phone.</li>
            <li>Quiz answers and scores, if you take the AI capability quiz.</li>
            <li>Course progress and ratings, if you&apos;re signed in and use a course.</li>
            <li>Purchase records (what you bought, the amount, and its status) — we do not receive or store your card or UPI details. Payment processing is handled entirely by Razorpay; we only see whether a payment succeeded.</li>
            <li>Basic technical data (IP address, timestamps) used only to rate-limit sign-in requests and stop abuse — not used for tracking or advertising.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold mb-2">What we don&apos;t do</h2>
          <ul className="list-disc pl-5 text-ink-soft space-y-1">
            <li>We don&apos;t sell your data to anyone.</li>
            <li>We don&apos;t share your email or phone number with advertisers.</li>
            <li>We don&apos;t use your quiz answers or course activity for anything beyond making the product work and understanding, in aggregate, what content is useful.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Who else sees data</h2>
          <ul className="list-disc pl-5 text-ink-soft space-y-1">
            <li><b>Razorpay</b> — processes payments. See their own privacy policy for what they retain.</li>
            <li><b>Google</b> — only if you choose "Continue with Google" instead of email/phone sign-in.</li>
            <li><b>Our database host (Supabase)</b> — stores the data described above, encrypted at rest, on their infrastructure.</li>
            <li>We do not send your personal data to the news sources we read from (TechCrunch, Ars Technica, etc.) — that relationship runs one way, us reading their public feeds.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Your rights</h2>
          <p className="text-ink-soft">
            You can delete your account and all associated personal data at any time from{" "}
            <a href="/settings" className="text-accent-ink underline">Settings → Danger Zone</a> — no
            need to email us and wait. Quiz attempts are anonymized rather than deleted (the record
            stays for aggregate statistics, but is no longer linked to you). Purchase records are
            kept as required for tax and accounting purposes even after account deletion, with
            personal identifiers removed where possible.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Contact</h2>
          <p className="text-ink-soft">
            Questions about this policy: <a href="mailto:hello@yourdomain.com" className="text-accent-ink underline">hello@yourdomain.com</a>
          </p>
        </section>

        <section className="border border-paper-line rounded p-4 text-xs text-ink-soft">
          <p>
            <b>Honest note:</b> this page accurately describes what the product actually does as of
            today — it isn&apos;t template filler. It has not been reviewed by a lawyer. Before relying
            on it for a real launch with paying customers, especially regarding India&apos;s DPDP Act
            and any GST obligations, have it checked by one.
          </p>
        </section>
      </div>
    </main>
  );
}
