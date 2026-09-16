import { EMAIL_ADDRESSES } from "@/lib/email";

// No names or personal emails, per the site owner's explicit choice —
// this describes the team without identifying either person individually.
export default function AboutUs() {
  return (
    <div className="border border-paper-line rounded p-6">
      <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-2">About us</p>
      <h2 className="font-display text-lg font-semibold mb-3">Two people, not a company.</h2>
      <p className="text-sm text-ink-soft max-w-xl mb-2">
        The Model Desk is built by two people: one with 10+ years in AI and Data Science, the other
        with 10 years in Data Science and Automation. No investors, no growth team — just two people
        who think AI should be genuinely understandable, not gatekept behind jargon or a big price tag.
        That&apos;s why the Starter Pack is ₹100.
      </p>
      <p className="text-sm text-ink-soft max-w-xl">
        Want to become a mentor?{" "}
        <a href={`mailto:${EMAIL_ADDRESSES.support}`} className="text-accent-ink underline">
          Email us
        </a>{" "}
        — tell us what you&apos;d want to mentor on and where you&apos;ve actually done it.
      </p>
    </div>
  );
}
