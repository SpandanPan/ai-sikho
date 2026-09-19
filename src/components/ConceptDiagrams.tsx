// SVG diagrams for AI Fluency with dramatic animations and proper spacing.
// Text/stroke colors use the site's rgb(var(--color-*)) tokens (see
// globals.css) so every diagram stays legible in both light and dark
// theme instead of hardcoding grays tuned for one background.
//
// The nested-layers, attention, transformer, and hallucination diagrams
// that used to live here have moved to PriorityVisuals.tsx as interactive
// components with their own navy/cream editorial palette. This file keeps
// the two that haven't been upgraded yet.

const INK = "rgb(var(--color-ink))";
const INK_SOFT = "rgb(var(--color-ink-soft))";

const animationStyles = `
  @keyframes barExplode {
    0% { height: 0; transform: translateY(10px); opacity: 0; }
    100% { height: var(--height); transform: translateY(0); opacity: 1; }
  }
  .data-bar { animation: barExplode 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
  .data-bar:nth-child(1) { animation-delay: 0.2s; --height: 20px; }
  .data-bar:nth-child(2) { animation-delay: 0.5s; --height: 45px; }
  .data-bar:nth-child(3) { animation-delay: 0.8s; --height: 75px; }
  .data-bar:nth-child(4) { animation-delay: 1.1s; --height: 95px; }

  @keyframes tokenBounce {
    0%, 100% { opacity: 0.4; transform: scale(0.8) translateY(8px); }
    50% { opacity: 1; transform: scale(1.1) translateY(0); }
  }
  .token-box { animation: tokenBounce 2.5s cubic-bezier(0.34, 1.56, 0.64, 1) infinite; }
  .token-box:nth-child(1) { animation-delay: 0s; }
  .token-box:nth-child(2) { animation-delay: 0.4s; }
  .token-box:nth-child(3) { animation-delay: 0.8s; }
`;

export function DataGrowthDiagram() {
  return (
    <div className="w-full">
      <style>{animationStyles}</style>
      <svg viewBox="0 0 340 190" className="w-full h-auto border border-paper-line rounded p-4 bg-paper-line/5">
        {/* Title, given its own clear band above the axes */}
        <text x="15" y="22" fontSize="12" fontWeight="bold" fill={INK}>
          Data Available for Training AI (trillions of words)
        </text>

        {/* Axes, starting below the title so nothing overlaps it */}
        <line x1="50" y1="150" x2="320" y2="150" stroke={INK_SOFT} strokeWidth="2" />
        <line x1="50" y1="150" x2="50" y2="35" stroke={INK_SOFT} strokeWidth="2" />

        {/* Y-axis label */}
        <text x="18" y="92" textAnchor="middle" fontSize="11" fontWeight="bold" fill={INK_SOFT} transform="rotate(-90 18 92)">
          Data Volume
        </text>
        {/* X-axis label */}
        <text x="185" y="172" textAnchor="middle" fontSize="11" fontWeight="bold" fill={INK_SOFT}>
          Decade
        </text>

        {/* Bars with better spacing and labels */}
        {[
          { decade: "'90s", height: 20, x: 90 },
          { decade: "'00s", height: 45, x: 150 },
          { decade: "'10s", height: 75, x: 210 },
          { decade: "'20s", height: 100, x: 270 },
        ].map((bar) => (
          <g key={bar.decade} className="data-bar" style={{ "--height": `${bar.height}px` } as React.CSSProperties}>
            <rect
              x={bar.x - 22}
              y={150 - bar.height}
              width="44"
              height={bar.height}
              fill="#3498db"
              fillOpacity="0.7"
              stroke="#3498db"
              strokeWidth="1.5"
              rx="2"
            />
            <text x={bar.x} y="165" textAnchor="middle" fontSize="10" fontWeight="bold" fill={INK}>
              {bar.decade}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export function TokenDiagram() {
  return (
    <div className="w-full">
      <style>{animationStyles}</style>
      <svg viewBox="0 0 340 140" className="w-full h-auto border border-paper-line rounded p-4 bg-paper-line/5">
        <text x="15" y="22" fontSize="12" fontWeight="bold" fill={INK}>
          How models read: &quot;Unbelievable&quot; → 3 tokens
        </text>

        {/* Token boxes with proper spacing */}
        {["Un", "believ", "able"].map((token, i) => (
          <g key={i} className="token-box">
            <rect
              x={70 + i * 95}
              y="45"
              width="75"
              height="45"
              fill="#3498db"
              fillOpacity="0.2"
              stroke="#3498db"
              strokeWidth="2"
              rx="6"
            />
            <text x={107.5 + i * 95} y="75" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#3498db">
              {token}
            </text>
          </g>
        ))}

        {/* Better label */}
        <text x="15" y="120" fontSize="11" fontWeight="bold" fill="#3498db">
          Why it matters:
        </text>
        <text x="15" y="135" fontSize="10" fill={INK_SOFT}>
          Models count and charge by tokens, not words.
        </text>
      </svg>
    </div>
  );
}
