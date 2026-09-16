// One small, topic-appropriate animated glyph per Interview Pack track —
// not decoration for its own sake, each one evokes what that track is
// actually about. All motion-safe: (see globals.css) so
// prefers-reduced-motion:reduce disables every one of these automatically.
export default function TrackIcon({ slug }: { slug: string }) {
  if (slug === "genai-engineer") {
    return (
      <span className="font-mono text-sm text-accent-ink" aria-hidden="true">
        &gt;<span className="motion-safe:animate-cursor-blink">_</span>
      </span>
    );
  }

  if (slug === "agentic-ai") {
    return (
      <span className="flex items-center gap-1" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-accent-ink motion-safe:animate-step-dot"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </span>
    );
  }

  if (slug === "data-scientist") {
    return (
      <span className="flex items-end gap-0.5 h-4" aria-hidden="true">
        {[0.5, 0.8, 0.35, 1].map((h, i) => (
          <span
            key={i}
            className="w-1 bg-accent-ink rounded-sm motion-safe:animate-bar-grow"
            style={{ height: `${h * 100}%`, animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </span>
    );
  }

  if (slug === "data-engineering") {
    return (
      <span className="relative w-8 h-3 overflow-hidden rounded-full bg-paper-line/60 flex-none" aria-hidden="true">
        <span className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-accent-ink motion-safe:animate-pipeline-flow" />
      </span>
    );
  }

  return null;
}
