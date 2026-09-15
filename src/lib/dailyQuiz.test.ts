import { describe, expect, it } from "vitest";
import { validateDailyQuiz, DAILY_QUIZ_SIZE } from "./dailyQuiz";

function makeQuestion(i: number) {
  return { question: `Q${i}?`, options: ["a", "b", "c", "d"], correctIdx: 1, explanation: `Because ${i}.` };
}

describe("validateDailyQuiz", () => {
  it("accepts exactly 10 well-formed questions", () => {
    const input = Array.from({ length: DAILY_QUIZ_SIZE }, (_, i) => makeQuestion(i));
    const result = validateDailyQuiz(input);
    expect(result).toHaveLength(DAILY_QUIZ_SIZE);
  });

  it("truncates to 10 when the model over-generates", () => {
    const input = Array.from({ length: 14 }, (_, i) => makeQuestion(i));
    expect(validateDailyQuiz(input)).toHaveLength(10);
  });

  it("rejects when there are fewer than 10 valid questions", () => {
    const input = Array.from({ length: 8 }, (_, i) => makeQuestion(i));
    expect(validateDailyQuiz(input)).toBeNull();
  });

  it("rejects a question missing a required field", () => {
    const input = Array.from({ length: 10 }, (_, i) => makeQuestion(i));
    delete (input[3] as Record<string, unknown>).explanation;
    expect(validateDailyQuiz(input)).toBeNull();
  });

  it("rejects a question with the wrong number of options", () => {
    const input = Array.from({ length: 10 }, (_, i) => makeQuestion(i));
    input[0].options = ["only", "three", "here"];
    expect(validateDailyQuiz(input)).toBeNull();
  });

  it("rejects a correctIdx outside 0-3", () => {
    const input = Array.from({ length: 10 }, (_, i) => makeQuestion(i));
    input[0].correctIdx = 4;
    expect(validateDailyQuiz(input)).toBeNull();
  });

  it("rejects non-array input entirely", () => {
    expect(validateDailyQuiz({ not: "an array" })).toBeNull();
  });

  it("rejects an empty array", () => {
    expect(validateDailyQuiz([])).toBeNull();
  });
});
