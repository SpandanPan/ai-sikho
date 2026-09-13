import { describe, expect, it } from "vitest";
import { isWithinBookingWindow, bookingWindow, BOOKING_WINDOW_DAYS } from "./mentorSlots";

describe("bookingWindow", () => {
  it("spans exactly BOOKING_WINDOW_DAYS from now", () => {
    const now = new Date("2026-09-13T00:00:00Z");
    const { from, to } = bookingWindow(now);
    expect(from).toEqual(now);
    expect(to.getTime() - from.getTime()).toBe(BOOKING_WINDOW_DAYS * 24 * 60 * 60 * 1000);
  });
});

describe("isWithinBookingWindow", () => {
  const now = new Date("2026-09-13T12:00:00Z");

  it("rejects a slot in the past", () => {
    const past = new Date("2026-09-12T12:00:00Z");
    expect(isWithinBookingWindow(past, now)).toBe(false);
  });

  it("accepts a slot later today", () => {
    const later = new Date("2026-09-13T18:00:00Z");
    expect(isWithinBookingWindow(later, now)).toBe(true);
  });

  it("accepts a slot 10 days out", () => {
    const in10 = new Date("2026-09-23T12:00:00Z");
    expect(isWithinBookingWindow(in10, now)).toBe(true);
  });

  it("accepts a slot exactly at the 15-day boundary", () => {
    const boundary = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);
    expect(isWithinBookingWindow(boundary, now)).toBe(true);
  });

  it("rejects a slot 16 days out", () => {
    const in16 = new Date("2026-09-29T12:00:01Z");
    expect(isWithinBookingWindow(in16, now)).toBe(false);
  });
});
