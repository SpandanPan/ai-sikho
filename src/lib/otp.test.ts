import { describe, expect, it } from "vitest";
import {
  generateOtp,
  hashOtp,
  isEmail,
  isValidIdentifier,
  normalizeIdentifier,
  otpExpiryDate,
  isOtpExpired,
  hasAttemptsRemaining,
} from "./otp";

describe("generateOtp", () => {
  it("always produces a 6-digit string", () => {
    for (let i = 0; i < 50; i++) {
      const code = generateOtp();
      expect(code).toMatch(/^\d{6}$/);
    }
  });
});

describe("hashOtp", () => {
  it("is deterministic for the same input", () => {
    expect(hashOtp("123456")).toBe(hashOtp("123456"));
  });

  it("differs for different codes", () => {
    expect(hashOtp("123456")).not.toBe(hashOtp("654321"));
  });

  it("never returns the plaintext code", () => {
    expect(hashOtp("123456")).not.toContain("123456");
  });
});

describe("isEmail", () => {
  it("accepts a well-formed email", () => {
    expect(isEmail("person@example.com")).toBe(true);
  });

  it("rejects a phone number", () => {
    expect(isEmail("+919876543210")).toBe(false);
  });
});

describe("isValidIdentifier", () => {
  it("accepts a valid email", () => {
    expect(isValidIdentifier("person@example.com")).toBe(true);
  });

  it("accepts a plausible Indian phone number with country code", () => {
    expect(isValidIdentifier("+91 98765 43210")).toBe(true);
  });

  it("rejects a too-short number", () => {
    expect(isValidIdentifier("12345")).toBe(false);
  });

  it("rejects garbage input", () => {
    expect(isValidIdentifier("not-an-identifier")).toBe(false);
  });
});

describe("normalizeIdentifier", () => {
  it("lowercases and trims an email", () => {
    expect(normalizeIdentifier("  Person@Example.com ")).toBe("person@example.com");
  });

  it("strips formatting from a phone number but keeps a leading +", () => {
    expect(normalizeIdentifier("+91 98765-43210")).toBe("+919876543210");
  });
});

describe("otpExpiryDate / isOtpExpired", () => {
  it("is not expired immediately after issuing", () => {
    const now = new Date("2026-01-01T00:00:00Z");
    expect(isOtpExpired(otpExpiryDate(now), now)).toBe(false);
  });

  it("is expired once 10 minutes have passed", () => {
    const now = new Date("2026-01-01T00:00:00Z");
    const expiry = otpExpiryDate(now);
    const later = new Date(now.getTime() + 10 * 60 * 1000 + 1);
    expect(isOtpExpired(expiry, later)).toBe(true);
  });
});

describe("hasAttemptsRemaining", () => {
  it("allows attempts below the cap", () => {
    expect(hasAttemptsRemaining(0)).toBe(true);
    expect(hasAttemptsRemaining(4)).toBe(true);
  });

  it("blocks at and beyond the cap", () => {
    expect(hasAttemptsRemaining(5)).toBe(false);
    expect(hasAttemptsRemaining(6)).toBe(false);
  });
});
