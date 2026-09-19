// SVG diagrams for AI Fluency with dramatic animations and proper spacing.
// Text/stroke colors use the site's rgb(var(--color-*)) tokens (see
// globals.css) so every diagram stays legible in both light and dark
// theme instead of hardcoding grays tuned for one background.

const INK = "rgb(var(--color-ink))";
const INK_SOFT = "rgb(var(--color-ink-soft))";
const PAPER_LINE = "rgb(var(--color-paper-line))";

const animationStyles = `
  @keyframes nestSlideIn {
    0% { opacity: 0; transform: scale(0.85); }
    100% { opacity: 1; transform: scale(1); }
  }
  .nest-layer { animation: nestSlideIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
  .nest-layer:nth-child(1) { animation-delay: 0.1s; }
  .nest-layer:nth-child(2) { animation-delay: 0.3s; }
  .nest-layer:nth-child(3) { animation-delay: 0.5s; }
  .nest-layer:nth-child(4) { animation-delay: 0.7s; }

  @keyframes wordGlow {
    0%, 15% { opacity: 0.3; filter: drop-shadow(0 0 0px rgba(230, 126, 34, 0)); }
    25%, 65% { opacity: 1; filter: drop-shadow(0 0 6px rgba(230, 126, 34, 0.6)); }
    75%, 100% { opacity: 0.3; filter: drop-shadow(0 0 0px rgba(230, 126, 34, 0)); }
  }
  .attention-word:nth-child(1) { animation: wordGlow 6s ease-in-out infinite; animation-delay: 0s; }
  .attention-word:nth-child(2) { animation: wordGlow 6s ease-in-out infinite; animation-delay: 0.8s; }
  .attention-word:nth-child(3) { animation: wordGlow 6s ease-in-out infinite; animation-delay: 1.6s; }
  .attention-word:nth-child(4) { animation: wordGlow 6s ease-in-out infinite; animation-delay: 2.4s; }
  .attention-word:nth-child(5) { animation: wordGlow 6s ease-in-out infinite; animation-delay: 3.2s; }

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

  @keyframes wrongShake {
    0%, 10%, 90%, 100% { opacity: 0.3; transform: translateX(0) scale(0.95); }
    20%, 80% { opacity: 1; transform: translateX(2px) scale(1.02); }
    50% { opacity: 1; transform: translateX(-2px) scale(1.02); }
  }
  .hallucination-wrong { animation: wrongShake 2.5s ease-in-out infinite; }

  @keyframes checkMark {
    0% { opacity: 0; transform: scale(0) rotate(-45deg); }
    50% { transform: scale(1.2) rotate(0); }
    100% { opacity: 1; transform: scale(1) rotate(0); }
  }
  .check-mark { animation: checkMark 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
  .check-mark:nth-child(1) { animation-delay: 0s; }
  .check-mark:nth-child(2) { animation-delay: 0.2s; }
  .check-mark:nth-child(3) { animation-delay: 0.4s; }

  @keyframes fadeSlideIn {
    0% { opacity: 0; transform: translateY(10px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  .fade-in { animation: fadeSlideIn 0.8s ease-out; }
`;

export function AiNestingDiagram() {
  return (
    <div className="w-full">
      <style>{animationStyles}</style>
      <svg viewBox="0 0 400 240" className="w-full h-auto border border-paper-line rounded p-4 bg-paper-line/5">
        {/* AI layer */}
        <g className="nest-layer">
          <rect x="15" y="15" width="250" height="210" fill="none" stroke="#a0a0a0" strokeWidth="2.5" rx="8" />
          <text x="35" y="38" fontSize="14" fontWeight="bold" fill={INK}>
            🌐 Artificial Intelligence
          </text>
          <text x="35" y="55" fontSize="11" fill={INK_SOFT}>
            Any system that does human-like tasks
          </text>
        </g>

        {/* ML layer */}
        <g className="nest-layer">
          <rect x="35" y="75" width="210" height="140" fill="none" stroke="#e67e22" strokeWidth="2.5" rx="8" />
          <text x="55" y="98" fontSize="14" fontWeight="bold" fill="#e67e22">
            🧠 Machine Learning
          </text>
          <text x="55" y="115" fontSize="11" fill={INK_SOFT}>
            Learns patterns from examples, not rules
          </text>
        </g>

        {/* Deep Learning layer */}
        <g className="nest-layer">
          <rect x="55" y="130" width="170" height="70" fill="none" stroke="#3498db" strokeWidth="2.5" rx="8" />
          <text x="75" y="153" fontSize="14" fontWeight="bold" fill="#3498db">
            ⚡ Deep Learning
          </text>
          <text x="75" y="170" fontSize="11" fill={INK_SOFT}>
            Layered neural networks
          </text>
        </g>

        {/* Connector from Deep Learning out to the LLM callout */}
        <line x1="225" y1="165" x2="305" y2="165" stroke="#2ecc71" strokeWidth="2" strokeDasharray="3,3" />

        {/* LLM callout, placed clear of every box above so nothing overlaps */}
        <g className="nest-layer">
          <circle cx="345" cy="165" r="42" fill="#2ecc71" fillOpacity="0.18" stroke="#2ecc71" strokeWidth="2.5" />
          <text x="345" y="163" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#2ecc71">
            LLMs
          </text>
          <text x="345" y="180" textAnchor="middle" fontSize="9" fill="#2ecc71">
            ChatGPT, Claude
          </text>
        </g>
      </svg>
    </div>
  );
}

export function AttentionDiagram() {
  return (
    <div className="w-full">
      <style>{animationStyles}</style>
      <svg viewBox="0 0 340 160" className="w-full h-auto border border-paper-line rounded p-4 bg-paper-line/5">
        <text x="15" y="22" fontSize="12" fontWeight="bold" fill={INK}>
          How attention works: &quot;The bank raised interest rates&quot;
        </text>

        {/* Words with better spacing */}
        {["The", "bank", "raised", "interest", "rates"].map((word, i) => {
          const x = 40 + i * 60;
          const isImportant = i === 1 || i === 2 || i === 3 || i === 4;
          return (
            <g key={word} className="attention-word">
              <rect
                x={x}
                y="50"
                width="48"
                height="38"
                fill={isImportant ? "#e67e22" : PAPER_LINE}
                fillOpacity="0.25"
                stroke={isImportant ? "#e67e22" : PAPER_LINE}
                strokeWidth="1.5"
                rx="4"
              />
              <text x={x + 24} y="78" textAnchor="middle" fontSize="12" fontWeight="bold" fill={INK}>
                {word}
              </text>
            </g>
          );
        })}

        {/* Better label positioning */}
        <text x="15" y="125" fontSize="11" fontWeight="bold" fill="#e67e22">
          Key insight:
        </text>
        <text x="15" y="140" fontSize="10" fill={INK_SOFT}>
          Highlighted words matter most to understanding &quot;bank&quot; — not word order
        </text>
      </svg>
    </div>
  );
}

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

export function HallucinationDiagram() {
  return (
    <div className="w-full">
      <style>{animationStyles}</style>
      <svg viewBox="0 0 340 160" className="w-full h-auto border border-paper-line rounded p-4 bg-paper-line/5">
        <text x="15" y="22" fontSize="12" fontWeight="bold" fill={INK}>
          The Hallucination Problem
        </text>
        <text x="15" y="40" fontSize="10" fill={INK_SOFT}>
          Question: &quot;When was the Eiffel Tower built?&quot;
        </text>

        {/* Correct answer */}
        <g>
          <rect x="25" y="60" width="130" height="50" fill="#2ecc71" fillOpacity="0.15" stroke="#2ecc71" strokeWidth="2.5" rx="6" />
          <text x="90" y="80" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#2ecc71">
            ✓ 1889
          </text>
          <text x="90" y="100" textAnchor="middle" fontSize="10" fill="#2ecc71">
            Correct
          </text>
        </g>

        {/* Hallucinated answer with dramatic shake */}
        <g className="hallucination-wrong">
          <rect x="185" y="60" width="130" height="50" fill="#e74c3c" fillOpacity="0.15" stroke="#e74c3c" strokeWidth="2.5" rx="6" />
          <text x="250" y="80" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#e74c3c">
            ✗ 1847
          </text>
          <text x="250" y="100" textAnchor="middle" fontSize="10" fill="#e74c3c">
            Made up
          </text>
        </g>

        {/* Better explanation, wrapped across two lines so it never runs off the canvas */}
        <text x="15" y="135" fontSize="11" fontWeight="bold" fill="#e74c3c">
          Key lesson:
        </text>
        <text x="15" y="149" fontSize="10" fill={INK_SOFT}>
          Never trust specific facts without checking —
        </text>
        <text x="15" y="161" fontSize="10" fill={INK_SOFT}>
          both answers sound equally sure.
        </text>
      </svg>
    </div>
  );
}

export function TransformerDiagram() {
  return (
    <div className="w-full">
      <style>{animationStyles}</style>
      <svg viewBox="0 0 360 235" className="w-full h-auto border border-paper-line rounded p-4 bg-paper-line/5">
        <text x="15" y="22" fontSize="12" fontWeight="bold" fill={INK}>
          Before vs After: The Transformer Breakthrough (2017)
        </text>

        {/* Before: sequential */}
        <g>
          <text x="75" y="50" textAnchor="middle" fontSize="11" fontWeight="bold" fill={INK_SOFT}>
            OLD: Word-by-word
          </text>
          <circle cx="45" cy="90" r="8" fill={PAPER_LINE} stroke={INK_SOFT} strokeWidth="1.5" />
          <circle cx="75" cy="90" r="8" fill={PAPER_LINE} stroke={INK_SOFT} strokeWidth="1.5" />
          <circle cx="105" cy="90" r="8" fill={PAPER_LINE} stroke={INK_SOFT} strokeWidth="1.5" />
          <line x1="55" y1="90" x2="65" y2="90" stroke={INK_SOFT} strokeWidth="1.5" />
          <line x1="85" y1="90" x2="95" y2="90" stroke={INK_SOFT} strokeWidth="1.5" />

          <text x="75" y="125" textAnchor="middle" fontSize="9" fill={INK_SOFT}>
            Slow ×
          </text>
          <text x="75" y="140" textAnchor="middle" fontSize="9" fill={INK_SOFT}>
            Forgot earlier words
          </text>
        </g>

        {/* Divider */}
        <line x1="180" y1="40" x2="180" y2="160" stroke={PAPER_LINE} strokeWidth="2" strokeDasharray="4,4" />

        {/* After: attention */}
        <g>
          <text x="285" y="50" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#2ecc71">
            NEW: Attention
          </text>
          <circle cx="255" cy="90" r="8" fill="#2ecc71" fillOpacity="0.3" stroke="#2ecc71" strokeWidth="1.5" />
          <circle cx="285" cy="90" r="8" fill="#2ecc71" fillOpacity="0.3" stroke="#2ecc71" strokeWidth="1.5" />
          <circle cx="315" cy="90" r="8" fill="#2ecc71" fillOpacity="0.3" stroke="#2ecc71" strokeWidth="1.5" />

          {/* Connection lines showing attention */}
          <line x1="255" y1="90" x2="285" y2="90" stroke="#2ecc71" strokeWidth="1" opacity="0.6" />
          <line x1="255" y1="90" x2="315" y2="90" stroke="#2ecc71" strokeWidth="1" opacity="0.6" />
          <line x1="285" y1="90" x2="315" y2="90" stroke="#2ecc71" strokeWidth="1" opacity="0.6" />

          <text x="285" y="125" textAnchor="middle" fontSize="9" fill="#2ecc71">
            Fast ✓
          </text>
          <text x="285" y="140" textAnchor="middle" fontSize="9" fill="#2ecc71">
            Sees all words
          </text>
        </g>

        {/* Impact, wrapped across two lines so it stays inside the canvas */}
        <text x="15" y="180" fontSize="11" fontWeight="bold" fill="#3498db">
          💡 Impact:
        </text>
        <text x="15" y="198" fontSize="10" fill={INK_SOFT}>
          Transformers could finally use billions of examples —
        </text>
        <text x="15" y="212" fontSize="10" fill={INK_SOFT}>
          every modern AI (GPT, BERT, Claude) uses this idea.
        </text>
      </svg>
    </div>
  );
}
