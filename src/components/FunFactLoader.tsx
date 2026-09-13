"use client";

import { useEffect, useState } from "react";

const FACTS = [
  "The term \"Artificial Intelligence\" was coined in 1956, at a summer workshop at Dartmouth College.",
  "Large language models are trained on one task, repeated trillions of times: predict the next word.",
  "A \"token\" isn't a whole word — it's often just a few characters or a word-fragment.",
  "AI models don't think between messages. Each reply starts fresh from what's visible in the context window.",
  "The first chatbot, ELIZA, was built in 1966 — it just reflected your own words back as questions.",
  "Several capable open-weight models can run entirely offline, on a laptop, for free.",
  "\"Hallucination\" means an AI states something false with total, unearned confidence.",
  "Image generators learn patterns from millions of pictures — they don't copy-paste existing photos.",
  "A bigger context window isn't automatically a smarter model — it's just a bigger visible workspace.",
];

// Shown once per page load, briefly — turns dead loading time into a small,
// accurate piece of AI trivia instead of a blank screen.
export default function FunFactLoader() {
  const [visible, setVisible] = useState(true);
  const [fact] = useState(() => FACTS[Math.floor(Math.random() * FACTS.length)]);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1300);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink text-paper px-6">
      <div className="max-w-sm text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-spark mb-3">Did you know?</p>
        <p className="font-display text-lg leading-snug">{fact}</p>
        <div className="mt-6 h-1 w-40 mx-auto bg-white/15 rounded overflow-hidden">
          <div className="h-full bg-spark animate-loaderbar" />
        </div>
      </div>
    </div>
  );
}
