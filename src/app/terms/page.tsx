export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-12 text-sm leading-relaxed">
      <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-2">Terms of Service</p>
      <h1 className="font-display text-2xl font-semibold mb-1">The plain-language rules.</h1>
      <p className="text-ink-soft mb-8">Last updated: draft, not yet reviewed by a lawyer — see the note at the bottom.</p>

      <div className="flex flex-col gap-6">
        <section>
          <h2 className="font-semibold mb-2">Your account</h2>
          <p className="text-ink-soft">
            One account per person. Accounts may be signed in on at most 2 devices at a time —
            this is enforced technically, not just a rule on paper. Sharing your sign-in access
            (email/phone + code) with someone else so they can use paid content under your account
            is not allowed and may result in the account being suspended.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Paid content</h2>
          <p className="text-ink-soft">
            The Interview Kit, Starter Pack, paid courses, and mentoring sessions are for your own
            personal use. Redistributing, reselling, or publicly re-sharing purchased content
            (question banks, course material, session recordings if any) is not allowed.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Refunds</h2>
          <p className="text-ink-soft">
            Digital products (Starter Pack, Interview Kit, courses) are refundable within 7 days of
            purchase if you haven&apos;t downloaded or accessed the content. Once accessed, purchases
            are final — this is a content product, not a physical good, and access can&apos;t be
            "returned." Mentoring session bookings can be cancelled or rescheduled up to 24 hours
            before the scheduled time for a full refund; cancellations after that are non-refundable
            unless the mentor cancels.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Mentoring sessions</h2>
          <p className="text-ink-soft">
            Mentors are onboarded and vetted by us, but sessions are advice and guidance, not a
            guarantee of any outcome (a job offer, a specific result, etc.). We facilitate the
            booking and payment; the substance of a session is between you and the mentor.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Accuracy of content</h2>
          <p className="text-ink-soft">
            The AI Pulse news feed excerpts and links to third-party sources — we don&apos;t control or
            vouch for their accuracy. Model costs, interview questions, and articles are kept as
            current and accurate as we reasonably can, but AI model pricing and the industry itself
            change quickly; verify anything time-sensitive independently before relying on it.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Limitation of liability</h2>
          <p className="text-ink-soft">
            This product is provided as-is. We're not liable for interview outcomes, job outcomes,
            business decisions, or anything else you do based on content here — it's educational
            material and mentoring guidance, not a guarantee.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Governing law</h2>
          <p className="text-ink-soft">These terms are governed by the laws of India.</p>
        </section>

        <section className="border border-paper-line rounded p-4 text-xs text-ink-soft">
          <p>
            <b>Honest note:</b> this page accurately describes the product&apos;s actual policies as of
            today — it isn&apos;t template filler. It has not been reviewed by a lawyer. Have it checked
            by one before relying on it for a real launch with paying customers.
          </p>
        </section>
      </div>
    </main>
  );
}
