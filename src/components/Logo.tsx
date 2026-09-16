// A small "network node" mark — three connected nodes forming a triangle —
// instead of a plain letter tile. Uses the existing theme color tokens
// (fill-ink/fill-spark/fill-accent2/fill-paper), so it re-themes correctly
// in dark mode with zero extra work, same as every other themed element.
export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true" className="flex-none">
      <rect width="32" height="32" rx="9" className="fill-ink" />
      <path d="M10 21 16 10 22 21Z" className="stroke-paper/35" strokeWidth="1.4" fill="none" strokeLinejoin="round" />
      <circle cx="16" cy="10" r="2.75" className="fill-spark" />
      <circle cx="10" cy="21" r="2.75" className="fill-accent2" />
      <circle cx="22" cy="21" r="2.75" className="fill-paper" />
    </svg>
  );
}
