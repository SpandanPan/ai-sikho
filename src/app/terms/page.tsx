import { EMAIL_ADDRESSES } from "@/lib/email";

export default function TermsPage() {
  const sellerName = process.env.BUSINESS_LEGAL_NAME ?? "AI Sikho";
  const sellerAddress = process.env.BUSINESS_ADDRESS ?? "";

  return (
    <main className="mx-auto max-w-2xl px-5 py-12 text-sm leading-relaxed">
      <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-2">Terms of Service</p>
      <h1 className="font-display text-2xl font-semibold mb-1">The plain-language rules.</h1>

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
            All sales are final — the Starter Pack, any Interview Kit, the Everything Bundle, paid
            courses, mentoring sessions, and paid mock-interview feedback are non-refundable once
            payment is completed. The narrow exceptions consumer law doesn&apos;t let a &quot;no
            refunds&quot; policy waive — genuinely not receiving what you paid for, or a
            duplicate/unauthorized charge — are handled case by case; see{" "}
            <a href="/refund-policy" className="text-accent-ink underline">/refund-policy</a> for how
            to raise one.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Eligibility</h2>
          <p className="text-ink-soft">
            You must be at least 18 years old to create an account or make a purchase. If
            you&apos;re under 18, a parent or legal guardian must create the account and be the one
            who transacts — the DPDP Act treats a minor&apos;s personal data as requiring verifiable
            parental consent, and we don&apos;t currently have a technical way to verify age or
            guardian consent at sign-up. Said plainly rather than silently assumed: this is a real
            gap, not a solved problem, and it should be addressed (an age-affirmation step, at
            minimum) before actively marketing to a school-age audience.
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
          <h2 className="font-semibold mb-2">Seller information &amp; grievance officer</h2>
          <p className="text-ink-soft">
            Under the Consumer Protection (E-Commerce) Rules, this information has to be
            disclosed, not just available on request: this service is operated as{" "}
            <b>{sellerName}</b>{sellerAddress ? `, ${sellerAddress}` : ""}. For any complaint about
            an order, a page, or these terms, email{" "}
            <a href={`mailto:${EMAIL_ADDRESSES.support}`} className="text-accent-ink underline">
              {EMAIL_ADDRESSES.support}
            </a>{" "}
            — see <a href="/privacy" className="text-accent-ink underline">/privacy</a> for our
            response-time commitment.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Governing law</h2>
          <p className="text-ink-soft">These terms are governed by the laws of India.</p>
        </section>
      </div>
    </main>
  );
}
