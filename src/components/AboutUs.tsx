import { EMAIL_ADDRESSES } from "@/lib/email";

// No personal names or photos, per the site owner's explicit choice — this
// describes each founder's real background and role in enough detail to
// build trust, without identifying either person by name. If that choice
// changes, this is the one file to edit.
const founders = [
  {
    role: "AI & Data Science",
    years: "10+ years",
    bio: "Has spent over a decade building and shipping machine learning and AI systems — from the classical statistical models most companies still quietly run in production, through to today's large language model and agentic systems. Has sat on both sides of the technical interview table: writing questions, and answering them.",
    focus: "Designs the technical interview tracks on this site (GenAI Engineer, Agentic AI, Data Science, Data Engineering), decides which model — local or frontier — powers which feature, and writes or reviews every piece of technical course content before it ships.",
  },
  {
    role: "Data Science & Automation",
    years: "10 years",
    bio: "A decade spent building data pipelines and automating workflows for teams that weren't, themselves, full of engineers — which meant translating what AI can actually do into plain language, over and over, for people whose job wasn't AI.",
    focus: "Owns the AI Fluency track end to end, the mentoring program's design, and the day-to-day of running this as an actual business — which is exactly why the Fluency track exists: it's the course this founder wished existed for the teams they used to train by hand.",
  },
];

export default function AboutUs() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-2">About us</p>
        <h1 className="font-display text-2xl font-semibold mb-3">Two people, not a company.</h1>
        <p className="text-sm text-ink-soft max-w-xl">
          AI Sikho is built and run by two people, no investors, no growth team. We keep our own
          names off this page on purpose — what matters is what we've actually done and what we're
          building here, not a headshot. That's also why the Starter Pack is ₹100: we think AI
          should be genuinely understandable, not gatekept behind jargon or a price tag.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {founders.map((f) => (
          <div key={f.role} className="border border-paper-line rounded p-5">
            <p className="font-mono text-[10.5px] uppercase tracking-widest text-accent2 mb-1">{f.years}</p>
            <h2 className="font-semibold text-base mb-2">{f.role}</h2>
            <p className="text-sm text-ink-soft mb-3">{f.bio}</p>
            <p className="text-xs text-ink-soft border-l-2 border-accent pl-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-accent-ink block mb-1">
                What they own here
              </span>
              {f.focus}
            </p>
          </div>
        ))}
      </div>

      <div className="border border-paper-line rounded p-6">
        <h2 className="font-semibold text-sm mb-1.5">Want to become a mentor?</h2>
        <p className="text-sm text-ink-soft mb-3">
          Tell us what you&apos;d want to mentor on and where you&apos;ve actually done it.
        </p>
        <a href={`mailto:${EMAIL_ADDRESSES.support}`} className="text-accent-ink underline text-sm">
          Email us →
        </a>
      </div>
    </div>
  );
}
