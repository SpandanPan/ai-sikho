"use client";

// Quick reference card for AI Fluency concepts

export default function AiFluencyCheatSheet() {
  const sections = [
    {
      title: "What You're Talking To",
      icon: "🧠",
      points: [
        "A pattern-prediction machine, not a search engine",
        "Trained once, not connected to the internet by default",
        "Predicts next word based on patterns from training data",
      ],
    },
    {
      title: "What It's Good At",
      icon: "✅",
      points: [
        "First drafts and brainstorming",
        "Explaining things in different ways",
        "Restructuring and reformatting text",
      ],
    },
    {
      title: "Where It Fails",
      icon: "⚠️",
      points: [
        "Specific facts (dates, numbers, names) — always verify",
        "Doesn't know anything after its training cutoff",
        "Sounds confident even when wrong (hallucinations)",
      ],
    },
    {
      title: "How to Use It Well",
      icon: "💡",
      points: [
        "Use it for structure, not for facts you can't verify",
        "Ask it to rephrase or explain different ways",
        "Check important facts independently",
      ],
    },
    {
      title: "Memory",
      icon: "🧪",
      points: [
        "Remembers within one conversation only",
        "Starts fresh when you open a new chat",
        "No persistent memory unless explicitly saved by the app",
      ],
    },
    {
      title: "Five Key Terms",
      icon: "📚",
      points: [
        "Prompt: what you type (how you phrase it matters a lot)",
        "Token: word-piece, unit of cost/counting",
        "Context window: how much text it can see at once",
        "Hallucination: confident, wrong answer",
        "Model: the system (GPT vs Gemini vs Claude = different models)",
      ],
    },
  ];

  return (
    <div className="w-full border border-paper-line rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-accent-ink/10 to-accent2/10 px-6 py-4 border-b border-paper-line">
        <h2 className="font-display text-xl font-semibold mb-1">Quick Reference: AI Fluency in 60 Seconds</h2>
        <p className="text-sm text-ink-soft">Bookmark this to remember what matters</p>
      </div>

      <div className="grid gap-3 p-6 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <div key={section.title} className="border border-paper-line rounded-lg p-4 hover:border-accent-ink transition-colors">
            <h3 className="font-semibold text-base mb-2 flex items-center gap-2">
              <span className="text-xl">{section.icon}</span>
              {section.title}
            </h3>
            <ul className="text-sm text-ink-soft space-y-1.5">
              {section.points.map((point, i) => (
                <li key={i} className="flex gap-2">
                  <span className="font-mono text-accent-ink flex-none">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-paper-line/5 px-6 py-4 border-t border-paper-line">
        <p className="text-xs text-ink-soft">
          <span className="font-mono text-accent-ink font-semibold">Pro tip:</span> The key insight is that AI predicts the next word — everything else follows from that single fact. When it fails, it's usually because you asked it for something prediction can't do (verify facts, remember you forever, connect to the internet).
        </p>
      </div>
    </div>
  );
}
