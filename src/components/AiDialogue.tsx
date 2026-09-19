"use client";

import { useState } from "react";

type DialogueStep = {
  character: "learner" | "guide";
  text: string;
  /** A short, playful aside shown under this line — the "reaction" beat. */
  reaction?: string;
};

const DIALOGUE: DialogueStep[] = [
  {
    character: "learner",
    text: "So... what even is AI? I keep hearing about it everywhere.",
  },
  {
    character: "guide",
    text: "Great question! Think of AI as teaching a computer to learn from examples instead of writing exact rules for it.",
  },
  {
    character: "learner",
    text: "Like... how?",
    reaction: "That sounds suspiciously like Google.",
  },
  {
    character: "guide",
    text: "Imagine teaching a kid to recognize dogs. You don't give them rules like 'if it has 4 legs and fur, it's a dog.' You just show them 100 pictures of dogs and say 'these are dogs.' Their brain figures out the pattern.",
  },
  {
    character: "learner",
    text: "Ah! So the computer learns the pattern from examples?",
  },
  {
    character: "guide",
    text: "Exactly. That's machine learning. And when you show it millions of examples — like ChatGPT reading billions of words — it gets really good at finding patterns.",
  },
  {
    character: "learner",
    text: "But wait, doesn't ChatGPT actually understand things?",
    reaction: "It sure talks like it does.",
  },
  {
    character: "guide",
    text: "Not really — it predicts the next word based on what usually comes after the words it's already seen. When you type 'The capital of France is,' it knows 'Paris' usually follows, so it says that.",
  },
  {
    character: "learner",
    text: "That's... kind of wild. So it's not thinking, just pattern-matching?",
  },
  {
    character: "guide",
    text: "Yep. And that's actually why it's so useful — you can use it for writing, brainstorming, learning. But also why you shouldn't trust every fact it says without checking.",
    reaction: "Helpful co-pilot, not a fact machine.",
  },
  {
    character: "learner",
    text: "Got it. So what can it actually help me with?",
  },
  {
    character: "guide",
    text: "First drafts, explaining things in different ways, reformatting text, brainstorming. Anything where you need a starting point or a different angle. Just add your judgment on top.",
  },
];

// A hand-rolled one-shot reveal, not Tailwind's motion-safe: prefix — that
// variant only covers utilities Tailwind itself generates, and silently
// no-ops on a hand-written class name like this one, so nothing would
// ever actually animate. Gated for reduced motion directly in the media
// query instead.
const dialogueStyles = `
  @keyframes dialogueReveal {
    0% { opacity: 0; transform: translateY(6px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @media (prefers-reduced-motion: no-preference) {
    .dialogue-reveal { animation: dialogueReveal 0.4s ease-out both; }
  }
`;

export default function AiDialogue() {
  const [step, setStep] = useState(0);
  const isComplete = step >= DIALOGUE.length;

  return (
    <div className="border border-paper-line rounded p-6 bg-paper-line/5">
      <style>{dialogueStyles}</style>
      <div className="mb-6">
        {/* Characters — normal flow, side by side, so nothing below can overlap them */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-20 flex flex-col items-center flex-none">
            <div className="w-16 h-16 rounded-full bg-gradient-to-b from-accent2 to-accent2/70 flex items-center justify-center text-2xl mb-2">
              🎓
            </div>
            <span className="font-mono text-[10px] text-ink-soft">Learner</span>
          </div>
          <div className="w-20 flex flex-col items-center flex-none">
            <div className="w-16 h-16 rounded-full bg-gradient-to-b from-accent-ink to-accent-ink/70 flex items-center justify-center text-2xl mb-2">
              🧠
            </div>
            <span className="font-mono text-[10px] text-ink-soft">Guide</span>
          </div>
        </div>

        {/* Speech bubbles */}
        <div className="min-h-[100px] flex items-center">
          {step < DIALOGUE.length && (
            <div
              key={step}
              className={`dialogue-reveal w-full flex ${
                DIALOGUE[step].character === "learner" ? "justify-start" : "justify-end"
              }`}
            >
              <div className="max-w-xs">
                <div
                  className={`rounded-lg p-3 text-sm leading-relaxed ${
                    DIALOGUE[step].character === "learner"
                      ? "bg-accent2/15 border border-accent2/50 text-ink-soft"
                      : "bg-accent-ink/15 border border-accent-ink/50 text-ink-soft"
                  }`}
                >
                  {DIALOGUE[step].text}
                </div>
                {DIALOGUE[step].reaction && (
                  <p
                    className={`dialogue-reveal mt-1.5 text-xs italic text-ink-soft/80 ${
                      DIALOGUE[step].character === "learner" ? "text-left" : "text-right"
                    }`}
                    style={{ animationDelay: "0.25s" }}
                  >
                    &ldquo;{DIALOGUE[step].reaction}&rdquo;
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Progress indicator */}
        <div className="mt-6 flex gap-1 justify-center">
          {DIALOGUE.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i <= step ? "w-3 bg-accent-ink" : "w-1.5 bg-paper-line"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="font-mono text-xs border border-paper-line rounded px-3 py-2 disabled:opacity-40"
        >
          ← Back
        </button>
        <button
          onClick={() => setStep(Math.min(DIALOGUE.length, step + 1))}
          disabled={isComplete}
          className="font-mono text-xs bg-ink text-paper rounded px-3 py-2 disabled:opacity-40"
        >
          {isComplete ? "Done!" : "Next →"}
        </button>
      </div>

      {isComplete && (
        <p className="text-xs text-ink-soft text-center mt-4">
          Now you've got the core idea — the next sections dig deeper into how it all works.
        </p>
      )}
    </div>
  );
}
