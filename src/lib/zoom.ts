// Video-call link creation for paid mentor bookings.
//
// Uses Zoom Server-to-Server OAuth (an account-level app type — no
// per-mentor Zoom login or OAuth redirect flow, one app under the
// platform's own Zoom account creates every meeting). Chosen because a
// free Zoom Basic account has no time limit on 1:1 meetings — the
// well-known 40-minute cap only applies to meetings with 3+ participants —
// so this genuinely costs $0. See COSTS.md.
//
// NOT wired up in this environment (no live ZOOM_* credentials, same
// situation as RAZORPAY_*/ANTHROPIC_API_KEY elsewhere in this codebase).
// When ZOOM_ACCOUNT_ID/CLIENT_ID/CLIENT_SECRET aren't set,
// isZoomConfigured() is false and the webhook falls back to the mentor's
// own personalMeetingUrl instead — see src/app/api/webhooks/razorpay.

export function isZoomConfigured(): boolean {
  return Boolean(
    process.env.ZOOM_ACCOUNT_ID && process.env.ZOOM_CLIENT_ID && process.env.ZOOM_CLIENT_SECRET
  );
}

export function buildZoomMeetingRequestBody(topic: string, startTime: Date, durationMinutes: number) {
  return {
    topic,
    type: 2, // scheduled meeting
    start_time: startTime.toISOString(),
    duration: durationMinutes,
    settings: {
      join_before_host: true, // customer shouldn't be stuck waiting if the mentor is a minute late
      waiting_room: false,
      approval_type: 2, // no registration required
    },
  };
}

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.token;

  const basic = Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString("base64");
  const res = await fetch(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`,
    { method: "POST", headers: { Authorization: `Basic ${basic}` } }
  );
  if (!res.ok) throw new Error(`Zoom auth failed: ${res.status}`);
  const data = await res.json();
  cachedToken = { token: data.access_token, expiresAt: Date.now() + (data.expires_in - 60) * 1000 };
  return cachedToken.token;
}

export type ZoomMeeting = { joinUrl: string; hostUrl: string; meetingId: string };

export async function createZoomMeeting(topic: string, startTime: Date, durationMinutes: number): Promise<ZoomMeeting> {
  const token = await getAccessToken();
  const res = await fetch("https://api.zoom.us/v2/users/me/meetings", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(buildZoomMeetingRequestBody(topic, startTime, durationMinutes)),
  });
  if (!res.ok) throw new Error(`Zoom meeting creation failed: ${res.status}`);
  const data = await res.json();
  return { joinUrl: data.join_url, hostUrl: data.start_url, meetingId: String(data.id) };
}
