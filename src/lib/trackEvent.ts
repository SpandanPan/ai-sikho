"use client";

function getAnonId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let id = localStorage.getItem("anonId");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("anonId", id);
    }
    return id;
  } catch {
    return "unknown"; // localStorage unavailable (private mode, etc.)
  }
}

type EventPayload = {
  type: "PAGE_VIEW" | "CLICK" | "TIME_ON_PAGE";
  path: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  label?: string;
  valueMs?: number;
};

// utm_* params only ever appear on the URL of the page that started the
// visit (the link someone actually clicked) — by the time a visitor is two
// clicks deep on the site, the query string is gone. So they're captured
// once per browser, on whichever page view sees them first, and reused for
// every event after that — otherwise a campaign's attribution would vanish
// the moment the visitor navigated anywhere else on the site.
function captureUtmParams(): { utmSource?: string; utmMedium?: string; utmCampaign?: string } {
  if (typeof window === "undefined") return {};
  try {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = {
      utmSource: params.get("utm_source") ?? undefined,
      utmMedium: params.get("utm_medium") ?? undefined,
      utmCampaign: params.get("utm_campaign") ?? undefined,
    };
    if (fromUrl.utmSource || fromUrl.utmMedium || fromUrl.utmCampaign) {
      localStorage.setItem("utmParams", JSON.stringify(fromUrl));
      return fromUrl;
    }
    const stored = localStorage.getItem("utmParams");
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {}; // localStorage unavailable — attribution is best-effort, not load-bearing
  }
}

function send(payload: EventPayload, useBeacon = false) {
  const body = JSON.stringify({ ...payload, anonId: getAnonId() });
  if (useBeacon && navigator.sendBeacon) {
    navigator.sendBeacon("/api/analytics/event", new Blob([body], { type: "application/json" }));
    return;
  }
  fetch("/api/analytics/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: useBeacon,
  }).catch(() => {});
}

// Exported for any component to call on a click it wants to track — see
// AnalyticsBeacon for the automatic PAGE_VIEW/TIME_ON_PAGE tracking.
export function trackClick(label: string) {
  send({ type: "CLICK", path: window.location.pathname, label });
}

export function trackPageView(path: string) {
  send({ type: "PAGE_VIEW", path, referrer: document.referrer || undefined, ...captureUtmParams() });
}

export function trackTimeOnPage(path: string, valueMs: number) {
  send({ type: "TIME_ON_PAGE", path, valueMs }, true);
}
