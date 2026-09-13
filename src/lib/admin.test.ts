import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { isAdminEmail } from "./admin";

describe("isAdminEmail", () => {
  const original = process.env.ADMIN_EMAILS;

  beforeEach(() => {
    process.env.ADMIN_EMAILS = "owner@example.com, second@example.com";
  });

  afterEach(() => {
    process.env.ADMIN_EMAILS = original;
  });

  it("allows an email in the list", () => {
    expect(isAdminEmail("owner@example.com")).toBe(true);
  });

  it("is case-insensitive", () => {
    expect(isAdminEmail("Owner@Example.com")).toBe(true);
  });

  it("ignores surrounding whitespace in the env list", () => {
    expect(isAdminEmail("second@example.com")).toBe(true);
  });

  it("rejects an email not in the list", () => {
    expect(isAdminEmail("random@example.com")).toBe(false);
  });

  it("rejects null/undefined/empty", () => {
    expect(isAdminEmail(null)).toBe(false);
    expect(isAdminEmail(undefined)).toBe(false);
    expect(isAdminEmail("")).toBe(false);
  });

  it("denies everyone when ADMIN_EMAILS is unset", () => {
    delete process.env.ADMIN_EMAILS;
    expect(isAdminEmail("owner@example.com")).toBe(false);
  });
});
