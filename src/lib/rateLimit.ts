// Pure policy, database-backed rather than Redis — fine at this scale (one
// query against OtpCode's existing rows, already indexed on identifier),
// and one less service to run. Revisit if OTP volume ever gets large enough
// for this query to matter.
export const MIN_SECONDS_BETWEEN_REQUESTS = 30;
export const MAX_PER_IDENTIFIER_PER_WINDOW = 3;
export const MAX_PER_IP_PER_WINDOW = 10;
export const WINDOW_MINUTES = 15;

export type RateLimitResult = { allowed: true } | { allowed: false; reason: string };

function withinWindowCount(recentTimestampsDesc: Date[], windowStart: Date): number {
  return recentTimestampsDesc.filter((t) => t >= windowStart).length;
}

// For a single identifier (the same person hitting "resend" repeatedly):
// both a short cooldown between individual requests AND a cap on total
// requests in the window.
export function checkIdentifierRateLimit(
  recentTimestampsDesc: Date[],
  now: Date = new Date(),
  maxPerWindow: number = MAX_PER_IDENTIFIER_PER_WINDOW,
  windowMinutes: number = WINDOW_MINUTES
): RateLimitResult {
  if (recentTimestampsDesc.length > 0) {
    const secondsSinceLast = (now.getTime() - recentTimestampsDesc[0].getTime()) / 1000;
    if (secondsSinceLast < MIN_SECONDS_BETWEEN_REQUESTS) {
      const wait = Math.ceil(MIN_SECONDS_BETWEEN_REQUESTS - secondsSinceLast);
      return { allowed: false, reason: `Please wait ${wait}s before requesting another code.` };
    }
  }

  const windowStart = new Date(now.getTime() - windowMinutes * 60 * 1000);
  if (withinWindowCount(recentTimestampsDesc, windowStart) >= maxPerWindow) {
    return { allowed: false, reason: "Too many requests. Try again in a few minutes." };
  }

  return { allowed: true };
}

// For an IP address: total-volume cap only, deliberately NO per-request
// cooldown. Many unrelated, legitimate people can share one IP (mobile
// carrier NAT is the common case in India) — a cooldown here would let one
// person's request block a stranger's on the same network moments later.
export function checkIpRateLimit(
  recentTimestampsDesc: Date[],
  now: Date = new Date(),
  maxPerWindow: number = MAX_PER_IP_PER_WINDOW,
  windowMinutes: number = WINDOW_MINUTES
): RateLimitResult {
  const windowStart = new Date(now.getTime() - windowMinutes * 60 * 1000);
  if (withinWindowCount(recentTimestampsDesc, windowStart) >= maxPerWindow) {
    return { allowed: false, reason: "Too many requests from this network. Try again shortly." };
  }
  return { allowed: true };
}
