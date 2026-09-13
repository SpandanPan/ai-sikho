import crypto from "node:crypto";

const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export function generateOtp(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

export function hashOtp(code: string): string {
  return crypto.createHash("sha256").update(code).digest("hex");
}

export function isEmail(identifier: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
}

// Deliberately loose — real phone validation (country codes, length rules)
// belongs to whichever SMS provider (MSG91/Twilio) eventually sends the
// code. This only rejects obvious garbage before we bother generating one.
export function isValidIdentifier(identifier: string): boolean {
  const trimmed = identifier.trim();
  if (isEmail(trimmed)) return true;
  const digits = trimmed.replace(/[^0-9]/g, "");
  return digits.length >= 8 && digits.length <= 15;
}

export function normalizeIdentifier(identifier: string): string {
  const trimmed = identifier.trim();
  return isEmail(trimmed) ? trimmed.toLowerCase() : trimmed.replace(/[^0-9+]/g, "");
}

export function otpExpiryDate(from: Date = new Date()): Date {
  return new Date(from.getTime() + OTP_TTL_MS);
}

export function isOtpExpired(expiresAt: Date, now: Date = new Date()): boolean {
  return expiresAt.getTime() <= now.getTime();
}

export function hasAttemptsRemaining(attempts: number): boolean {
  return attempts < MAX_ATTEMPTS;
}
