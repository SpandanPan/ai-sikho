// Pure validation logic, kept separate from the route handlers so it's
// unit-testable without a database or a session.

export function isValidPercent(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 100;
}

export function isValidRating(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 5;
}

export function isCompleting(previousPercent: number, nextPercent: number): boolean {
  return previousPercent < 100 && nextPercent === 100;
}
