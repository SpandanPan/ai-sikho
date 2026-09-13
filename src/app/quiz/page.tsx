"use client";

import { useState } from "react";
import { quizQuestions } from "@/data/quizQuestions";
import { feedbackFor } from "@/lib/quizFeedback";
import FunFactLoader from "@/components/FunFactLoader";

type Answer = { questionId: string; chosenIdx: number; correct: boolean };

export default function QuizPage() {
  const [step, setStep] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [done, setDone] = useState(false);

  const q = quizQuestions[step];
  const score = answers.filter((a) => a.correct).length;

  function pick(idx: number) {
    if (chosen !== null) return;
    setChosen(idx);
  }

  function next() {
    const correct = chosen === q.correctIdx;
    const nextAnswers = [...answers, { questionId: q.id, chosenIdx: chosen!, correct }];
    setAnswers(nextAnswers);
    setChosen(null);

    if (step + 1 < quizQuestions.length) {
      setStep(step + 1);
    } else {
      setDone(true);
      fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score: nextAnswers.filter((a) => a.correct).length,
          total: quizQuestions.length,
          answers: nextAnswers,
        }),
      }).catch(() => {});
    }
  }

  function retake() {
    setStep(0);
    setChosen(null);
    setAnswers([]);
    setDone(false);
  }

  return (
    <main className="mx-auto max-w-xl px-5 py-12">
      <FunFactLoader />
      <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-2">Free · 6 questions</p>
      <h1 className="font-display text-2xl font-semibold mb-6">What Can AI Actually Do?</h1>

      <div className="border border-accent rounded bg-paper-raised p-6">
        {!done ? (
          <>
            <p className="font-mono text-xs text-accent2 mb-3">
              Question {step + 1} of {quizQuestions.length}
            </p>
            <p className="text-lg mb-4">{q.question}</p>
            <div className="flex flex-col gap-2">
              {q.options.map((opt, idx) => {
                const isChosen = chosen === idx;
                const isCorrect = idx === q.correctIdx;
                const state =
                  chosen === null ? "" : isCorrect ? "correct" : isChosen ? "incorrect" : "";
                return (
                  <button
                    key={opt}
                    disabled={chosen !== null}
                    onClick={() => pick(idx)}
                    className={`text-left px-3.5 py-2.5 rounded border text-sm ${
                      state === "correct"
                        ? "border-accent2 bg-accent2/15"
                        : state === "incorrect"
                        ? "border-rust bg-rust/15"
                        : "border-paper-line bg-paper hover:border-accent"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {chosen !== null && (
              <>
                <div className="mt-4 border-l-2 border-accent bg-paper rounded p-3 text-sm text-ink-soft">
                  {q.explanation}
                </div>
                <button
                  onClick={next}
                  className="mt-4 font-mono text-sm bg-ink text-paper rounded px-4 py-2"
                >
                  {step + 1 < quizQuestions.length ? "Next →" : "See my result"}
                </button>
              </>
            )}
          </>
        ) : (
          <div>
            <div className="font-display text-4xl text-accent-ink mb-2">
              {score} / {quizQuestions.length}
            </div>
            <h2 className="font-semibold mb-2">{feedbackFor(score, quizQuestions.length).headline}</h2>
            <p className="text-sm text-ink-soft mb-5">{feedbackFor(score, quizQuestions.length).body}</p>
            <div className="flex gap-3 flex-wrap">
              <button onClick={retake} className="font-mono text-sm border border-paper-line rounded px-4 py-2">
                Retake quiz
              </button>
              <a href="/" className="font-mono text-sm bg-ink text-paper rounded px-4 py-2">
                Back to The Model Desk
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
