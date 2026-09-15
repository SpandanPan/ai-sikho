// Shared by every "one fresh thing per day" feature (daily quiz, term of
// the day) so "today" means the same UTC calendar day everywhere, not
// whatever timezone a particular server happens to be in.
export function startOfUtcDay(now: Date = new Date()): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}
