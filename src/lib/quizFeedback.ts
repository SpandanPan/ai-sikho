export type QuizFeedback = { headline: string; body: string };

// Pulled out of the quiz page so the score-band logic is unit-testable.
export function feedbackFor(score: number, total: number): QuizFeedback {
  if (total <= 0) {
    throw new Error("feedbackFor: total must be greater than 0");
  }
  const pct = score / total;

  if (pct >= 0.83) {
    return {
      headline: "You've got a strong handle on AI's real capabilities.",
      body: "You're past the myths most people carry. The Start Here guide and the Interview Pack are your natural next stops.",
    };
  }
  if (pct >= 0.5) {
    return {
      headline: "Good instincts, a few myths worth unlearning.",
      body: "Our Model Demystified explainers fill in exactly the gaps this quiz just found.",
    };
  }
  return {
    headline: "Plenty of AI folklore out there — you're exactly who this site is for.",
    body: "Start with Run It Free and the AI Pulse feed, no jargon required.",
  };
}
