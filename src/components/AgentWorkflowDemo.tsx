"use client";

import { useState } from "react";

type Step = { actor: "User" | "Agent" | "Tool"; text: string };

// A scripted, deterministic walkthrough — not a live LLM call — of the one
// thing that actually separates an agent from a chatbot (see the Quiz's
// "agents" question): taking multi-step actions with tools, not just
// replying once. Labeled clearly as illustrative rather than dressed up
// as something it isn't.
const STEPS: Step[] = [
  { actor: "User", text: "Is it going to rain in Mumbai tomorrow? Should I carry an umbrella?" },
  { actor: "Agent", text: "I don't have live weather data — I need to call a tool for this instead of guessing." },
  { actor: "Tool", text: "get_weather(city: \"Mumbai\", date: \"tomorrow\") → { condition: \"heavy rain\", rainChance: 85% }" },
  { actor: "Agent", text: "85% chance of heavy rain — that's high enough to act on." },
  { actor: "Agent", text: "Yes — heavy rain is likely tomorrow in Mumbai (85% chance). Carry an umbrella." },
];

const ACTOR_STYLE: Record<Step["actor"], string> = {
  User: "border-paper-line",
  Agent: "border-accent bg-paper-raised",
  Tool: "border-accent2 bg-accent2/10 font-mono text-xs",
};

export default function AgentWorkflowDemo() {
  const [step, setStep] = useState(0);

  return (
    <div className="border border-paper-line rounded p-4">
      <p className="font-mono text-[10.5px] uppercase tracking-widest text-accent2 mb-1">Live demo (scripted)</p>
      <h3 className="font-semibold text-sm mb-2">How an AI agent actually differs from a chatbot</h3>

      <div className="flex flex-col gap-2 mb-3 min-h-[9rem]">
        {STEPS.slice(0, step + 1).map((s, i) => (
          <div key={i} className={`border rounded px-3 py-2 text-sm ${ACTOR_STYLE[s.actor]}`}>
            <span className="font-mono text-[10.5px] uppercase text-ink-soft mr-1.5">{s.actor}</span>
            {s.text}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {STEPS.map((_, i) => (
            <span key={i} className={`w-1.5 h-1.5 rounded-full ${i <= step ? "bg-accent-ink" : "bg-paper-line"}`} />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="font-mono text-[10.5px] border border-paper-line rounded px-2.5 py-1 disabled:opacity-30"
          >
            ← Back
          </button>
          <button
            onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
            disabled={step === STEPS.length - 1}
            className="font-mono text-[10.5px] bg-ink text-paper rounded px-2.5 py-1 disabled:opacity-30"
          >
            Next step →
          </button>
        </div>
      </div>
      <p className="text-xs text-ink-soft mt-3">
        A chatbot would guess an answer from training data alone. An agent recognizes it needs current
        information, calls a tool to get it, then reasons over the real result.
      </p>
    </div>
  );
}
