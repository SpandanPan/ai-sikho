export const BOOKING_WINDOW_DAYS = 15;

// "Available to book" means: in the future, and within the next 15 days
// from whenever someone is actually looking — not a fixed calendar window,
// so this has to be computed relative to `now` on every call.
export function bookingWindow(now: Date = new Date()): { from: Date; to: Date } {
  const to = new Date(now.getTime() + BOOKING_WINDOW_DAYS * 24 * 60 * 60 * 1000);
  return { from: now, to };
}

export function isWithinBookingWindow(slotStart: Date, now: Date = new Date()): boolean {
  const { from, to } = bookingWindow(now);
  return slotStart >= from && slotStart <= to;
}
