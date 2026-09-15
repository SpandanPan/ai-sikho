export const FREE_ATTEMPTS_PER_MONTH = 1;

// Calendar month, not a rolling 30 days — simplest rule to explain to a
// user ("one free grading a month, resets on the 1st") and simplest to
// query (createdAt >= start of this month).
export function isSameCalendarMonth(a: Date, b: Date): boolean {
  return a.getUTCFullYear() === b.getUTCFullYear() && a.getUTCMonth() === b.getUTCMonth();
}

export function startOfMonth(now: Date = new Date()): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

// pastFreeAttempts: createdAt of this user's isFree=true submissions,
// however far back — the caller only needs to have queried this month's
// (see startOfMonth), but this stays correct even if it's handed more.
export function hasFreeAttemptRemaining(pastFreeAttempts: Date[], now: Date = new Date()): boolean {
  const usedThisMonth = pastFreeAttempts.filter((d) => isSameCalendarMonth(d, now)).length;
  return usedThisMonth < FREE_ATTEMPTS_PER_MONTH;
}
