import { EMAIL_ADDRESSES } from "@/lib/email";

export default function RefundPolicyPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-12 text-sm leading-relaxed">
      <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-2">Refund Policy</p>
      <h1 className="font-display text-2xl font-semibold mb-1">All sales are final.</h1>

      <div className="flex flex-col gap-6">
        <section>
          <h2 className="font-semibold mb-2">Every paid product on this site</h2>
          <p className="text-ink-soft">
            The Starter Pack, any Interview Kit, the Everything Bundle, paid courses, mentoring
            sessions, and paid mock-interview feedback are all <b>non-refundable</b> once payment is
            completed. We don&apos;t offer refunds for a change of mind, not liking the content, or
            deciding after the fact that you didn&apos;t need it. Please make sure before you buy.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">The narrow exceptions that still apply</h2>
          <p className="text-ink-soft">
            A stated &quot;no refunds&quot; policy can&apos;t actually waive certain protections consumer
            law gives you regardless of what a policy says — genuinely not receiving what you paid
            for (a course you were never given access to, a mentoring session that never happened
            because the mentor didn&apos;t show), or a duplicate/unauthorized charge. Those are handled
            case by case, as an explicit exception, not a right to request a refund for any reason.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">If you think you qualify for one of those exceptions</h2>
          <p className="text-ink-soft">
            Email{" "}
            <a href={`mailto:${EMAIL_ADDRESSES.support}`} className="text-accent-ink underline">
              {EMAIL_ADDRESSES.support}
            </a>{" "}
            with your purchase email/phone, what you bought, and what actually went wrong. Any
            refund we do issue goes back to your original payment method via Razorpay, typically
            within 5–7 business days of approval.
          </p>
        </section>
      </div>
    </main>
  );
}
