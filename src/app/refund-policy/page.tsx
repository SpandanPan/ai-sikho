export default function RefundPolicyPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-12 text-sm leading-relaxed">
      <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-2">Refund Policy</p>
      <h1 className="font-display text-2xl font-semibold mb-1">Stated plainly, up front.</h1>
      <p className="text-ink-soft mb-8">Last updated: draft, not yet reviewed by a lawyer — see the note at the bottom.</p>

      <div className="flex flex-col gap-6">
        <section>
          <h2 className="font-semibold mb-2">Digital products (Starter Pack, Interview Kit, courses)</h2>
          <p className="text-ink-soft">
            Refundable in full within <b>7 days of purchase</b>, as long as you haven&apos;t downloaded
            or accessed the content. Once you&apos;ve downloaded a kit or started a course, the sale is
            final — these are digital goods, and access can&apos;t be undone the way returning a
            physical product can.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Mentoring sessions</h2>
          <p className="text-ink-soft">
            Full refund if you cancel at least 24 hours before the scheduled time. Cancelling
            within 24 hours is non-refundable, except if the mentor is the one who cancels or
            doesn&apos;t show up — in that case you&apos;re refunded in full automatically.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">How to request one</h2>
          <p className="text-ink-soft">
            Email <a href="mailto:hello@yourdomain.com" className="text-accent-ink underline">hello@yourdomain.com</a> with
            your purchase email/phone and what you bought. Refunds are processed back to your
            original payment method via Razorpay, typically within 5–7 business days of approval.
          </p>
        </section>

        <section className="border border-paper-line rounded p-4 text-xs text-ink-soft">
          <p>
            <b>Honest note:</b> this reflects the product&apos;s actual, current policy — it isn&apos;t
            template filler. It has not been reviewed by a lawyer. Have it checked against India&apos;s
            consumer protection rules for digital goods before relying on it at real launch.
          </p>
        </section>
      </div>
    </main>
  );
}
