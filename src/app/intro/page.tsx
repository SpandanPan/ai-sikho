// Placeholder destination for the homepage hero's "Watch 1-min intro"
// link. No video exists yet — this is the plumbing (a real route to point
// at) so the hero link has somewhere honest to go instead of a video that
// doesn't exist. Swap the placeholder block below for a real <video>/embed
// once the intro is recorded — the rest of the page (copy, back link) can
// stay as-is.
export default function IntroPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-16 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-3">1-min intro</p>
      <h1 className="font-display text-2xl font-semibold mb-4">The video&apos;s on its way.</h1>
      <p className="text-ink-soft mb-8 max-w-md mx-auto">
        We&apos;re recording a proper one-minute walkthrough of what AI Sikho actually is. Until
        then, the quiz is the fastest way to see what this site is about.
      </p>
      <div className="aspect-video w-full rounded-lg border border-paper-line bg-paper-line/10 flex items-center justify-center mb-8">
        <span className="font-mono text-xs text-ink-soft">Video coming soon</span>
      </div>
      <a href="/quiz" className="font-mono text-xs bg-ink text-paper rounded px-4 py-2.5 inline-block">
        Take the 60-second AI quiz →
      </a>
    </main>
  );
}
