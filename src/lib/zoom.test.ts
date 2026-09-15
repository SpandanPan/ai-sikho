import { describe, expect, it, afterEach } from "vitest";
import { buildZoomMeetingRequestBody, isZoomConfigured } from "./zoom";

describe("buildZoomMeetingRequestBody", () => {
  it("sends a scheduled meeting with join-before-host and no registration", () => {
    const body = buildZoomMeetingRequestBody("Session with Priya", new Date("2026-10-01T10:00:00Z"), 30);
    expect(body.type).toBe(2);
    expect(body.duration).toBe(30);
    expect(body.start_time).toBe("2026-10-01T10:00:00.000Z");
    expect(body.settings.join_before_host).toBe(true);
    expect(body.settings.waiting_room).toBe(false);
  });
});

describe("isZoomConfigured", () => {
  const original = { ...process.env };
  afterEach(() => {
    process.env = { ...original };
  });

  it("is false when any Zoom env var is missing", () => {
    delete process.env.ZOOM_ACCOUNT_ID;
    delete process.env.ZOOM_CLIENT_ID;
    delete process.env.ZOOM_CLIENT_SECRET;
    expect(isZoomConfigured()).toBe(false);
  });

  it("is true when all three are set", () => {
    process.env.ZOOM_ACCOUNT_ID = "a";
    process.env.ZOOM_CLIENT_ID = "b";
    process.env.ZOOM_CLIENT_SECRET = "c";
    expect(isZoomConfigured()).toBe(true);
  });
});
