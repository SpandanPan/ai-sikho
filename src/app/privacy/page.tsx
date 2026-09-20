import { EMAIL_ADDRESSES } from "@/lib/email";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-12 text-sm leading-relaxed">
      <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-2">Privacy Policy</p>
      <h1 className="font-display text-2xl font-semibold mb-1">What we collect, and why.</h1>

      <div className="flex flex-col gap-6">
        <section>
          <h2 className="font-semibold mb-2">What we collect, and the specific purpose for each</h2>
          <p className="text-ink-soft mb-2">
            Under India&apos;s Digital Personal Data Protection Act, we&apos;re required to tell you why
            we collect each piece of data, not just that we do. So, specifically:
          </p>
          <ul className="list-disc pl-5 text-ink-soft space-y-1">
            <li>Your email address or phone number — to identify your account and sign you in by one-time code. We don&apos;t collect or store a password.</li>
            <li>Quiz answers and scores — to show you your own result and, in aggregate, to see which questions are too easy or too hard.</li>
            <li>Course progress and ratings — so your progress bar reflects reality and to improve course content.</li>
            <li>Purchase records (what, how much, and status) — required for order fulfillment, accounting, and tax records. We never receive or store your card or UPI details; Razorpay handles that, we only see whether a payment succeeded.</li>
            <li>Support messages you send us (name, email, your message) — to actually respond to you.</li>
            <li>IP address and request timestamps — only to rate-limit sign-in and form submissions and stop abuse. Not used for tracking or advertising.</li>
            <li>A random, non-identifying browser ID (in your browser&apos;s local storage, not tied to your name unless you&apos;re signed in) — to measure aggregate traffic and which pages/buttons get used, so we know what to build next.</li>
            <li>Your cart contents and theme preference — stored only in your browser&apos;s local storage, never sent to us until you actually check out.</li>
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
            <li><b>Google</b> — only if you choose &quot;Continue with Google&quot; instead of email/phone sign-in.</li>
            <li><b>Resend</b> (once live) — sends receipt, course, and support emails on our behalf; sees only the email address and content of that specific email.</li>
            <li><b>Our database host (Supabase)</b> — stores the data described above, encrypted at rest. Depending on which region your project uses, this may mean data is stored outside India; the DPDP Act permits this except to a small list of restricted countries, but this should be confirmed for our specific hosting region before real launch.</li>
            <li>We do not send your personal data to the news sources we read from (TechCrunch, Ars Technica, etc.) — that relationship runs one way, us reading their public feeds.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Your rights (Digital Personal Data Protection Act, 2023)</h2>
          <p className="text-ink-soft mb-2">As a "Data Principal" under the DPDP Act, you have the right to:</p>
          <ul className="list-disc pl-5 text-ink-soft space-y-1">
            <li><b>Access</b> a summary of what personal data we hold about you and who we&apos;ve shared it with.</li>
            <li><b>Correction and completion</b> of inaccurate or incomplete data — most of this you can already do yourself in <a href="/settings" className="text-accent-ink underline">Settings</a>.</li>
            <li><b>Erasure</b> — delete your account and associated personal data at any time from <a href="/settings" className="text-accent-ink underline">Settings → Danger Zone</a>, with no need to email us and wait. Quiz attempts are anonymized rather than deleted (kept for aggregate statistics, no longer linked to you); purchase records are kept as required for tax and accounting purposes even after account deletion, with personal identifiers removed where possible.</li>
            <li><b>Withdraw consent</b> at any time — for sign-in itself this means deleting your account, since an account can&apos;t function without an identifier; for optional things like the newsletter, use the unsubscribe link in any email.</li>
            <li><b>Grievance redressal</b> — see below.</li>
            <li><b>Nominate</b> another individual to exercise these rights on your behalf in the event of death or incapacity — contact us to register a nomination.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Children&apos;s data</h2>
          <p className="text-ink-soft">
            This service isn&apos;t intended for anyone under 18 without a parent or guardian creating
            and controlling the account (see <a href="/terms" className="text-accent-ink underline">Terms → Eligibility</a>).
            We don&apos;t currently verify age or guardian consent at sign-up — a real gap, not
            something to paper over, and something to fix (at minimum, an age-affirmation step)
            before this product is actively marketed to a school-age audience.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Data retention</h2>
          <p className="text-ink-soft">
            Account data is kept for as long as your account exists. Purchase and ledger records
            are kept for as long as tax/accounting law in India requires them to be, even if you
            delete your account. OTP codes expire and are never usable after 10 minutes; rate-limit
            and traffic-analytics records are kept only as long as needed for their stated purpose
            (abuse prevention, aggregate usage trends), not indefinitely.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Grievance officer / contact</h2>
          <p className="text-ink-soft">
            For any question about this policy, a request to exercise a right above, or a
            complaint about how your data is handled: email{" "}
            <a href={`mailto:${EMAIL_ADDRESSES.support}`} className="text-accent-ink underline">
              {EMAIL_ADDRESSES.support}
            </a>. We aim to acknowledge within a few days and resolve within 30 days as a service
            commitment — this is our own stated target, not a claim about a specific number of days
            set by the DPDP Act itself.
          </p>
        </section>
      </div>
    </main>
  );
}
