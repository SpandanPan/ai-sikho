// Pure streak math over a list of "days this user was active" (YYYY-MM-DD
// strings, one per distinct calendar day they had a page view — see
// /api/profile). Kept separate from the database query so the actual
// streak logic is testable without a database or a clock mock.
export type StreakResult = { current: number; longest: number };

function toDayNumber(day: string): number {
  return Math.floor(new Date(`${day}T00:00:00Z`).getTime() / 86_400_000);
}

export function computeStreak(activeDays: string[], today: string = new Date().toISOString().slice(0, 10)): StreakResult {
  if (activeDays.length === 0) return { current: 0, longest: 0 };

  const uniqueSorted = [...new Set(activeDays)].sort();
  const dayNumbers = uniqueSorted.map(toDayNumber);

  let longest = 1;
  let run = 1;
  for (let i = 1; i < dayNumbers.length; i++) {
    if (dayNumbers[i] === dayNumbers[i - 1] + 1) {
      run += 1;
    } else {
      run = 1;
    }
    longest = Math.max(longest, run);
  }

  // "Current" streak only counts if the most recent active day is today or
  // yesterday — otherwise it's broken, even if it was a long streak once.
  const todayNum = toDayNumber(today);
  const lastActive = dayNumbers[dayNumbers.length - 1];
  if (lastActive !== todayNum && lastActive !== todayNum - 1) {
    return { current: 0, longest };
  }

  let current = 1;
  for (let i = dayNumbers.length - 1; i > 0; i--) {
    if (dayNumbers[i] === dayNumbers[i - 1] + 1) {
      current += 1;
    } else {
      break;
    }
  }

  return { current, longest };
}
