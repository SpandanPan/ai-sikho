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
  label?: string;
  valueMs?: number;
};

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
  send({ type: "PAGE_VIEW", path, referrer: document.referrer || undefined });
}

export function trackTimeOnPage(path: string, valueMs: number) {
  send({ type: "TIME_ON_PAGE", path, valueMs }, true);
}
