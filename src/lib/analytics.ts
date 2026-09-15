// Pure aggregation over raw event rows — kept separate from the database
// query in /api/admin/reports/traffic so the actual math is testable
// without a database.
export type AnalyticsEventLike = {
  type: "PAGE_VIEW" | "CLICK" | "TIME_ON_PAGE";
  path: string;
  anonId: string;
  referrer?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  label?: string | null;
  valueMs?: number | null;
};

export type TrafficSummary = {
  pageViews: number;
  uniqueVisitors: number;
  clicks: number;
  avgTimeOnPageMs: number | null;
  topPaths: { path: string; views: number }[];
  topClicks: { label: string; count: number }[];
  topSources: { source: string; views: number }[];
};

// One label per page view, cheapest-to-richest signal available: a UTM
// campaign beats a UTM source alone, which beats the referring domain,
// which beats nothing at all (direct traffic or an app that strips
// referrers — these two are indistinguishable, so both fall under
// "(direct / unknown)" rather than a misleading "direct").
function attributeSource(e: AnalyticsEventLike): string {
  if (e.utmSource) return e.utmCampaign ? `${e.utmSource} / ${e.utmCampaign}` : e.utmSource;
  if (e.referrer) {
    try {
      return new URL(e.referrer).hostname.replace(/^www\./, "");
    } catch {
      return e.referrer;
    }
  }
  return "(direct / unknown)";
}

export function summarizeTraffic(events: AnalyticsEventLike[]): TrafficSummary {
  const pageViews = events.filter((e) => e.type === "PAGE_VIEW");
  const clicks = events.filter((e) => e.type === "CLICK");
  const timings = events.filter((e) => e.type === "TIME_ON_PAGE" && typeof e.valueMs === "number");

  const uniqueVisitors = new Set(events.map((e) => e.anonId)).size;

  const pathCounts = new Map<string, number>();
  for (const e of pageViews) {
    pathCounts.set(e.path, (pathCounts.get(e.path) ?? 0) + 1);
  }
  const topPaths = [...pathCounts.entries()]
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views);

  const clickCounts = new Map<string, number>();
  for (const e of clicks) {
    const label = e.label ?? "(unlabeled)";
    clickCounts.set(label, (clickCounts.get(label) ?? 0) + 1);
  }
  const topClicks = [...clickCounts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);

  // Attributed per page view, not per visitor — one visitor browsing 5
  // pages counts 5 times here, same convention as topPaths above.
  const sourceCounts = new Map<string, number>();
  for (const e of pageViews) {
    const source = attributeSource(e);
    sourceCounts.set(source, (sourceCounts.get(source) ?? 0) + 1);
  }
  const topSources = [...sourceCounts.entries()]
    .map(([source, views]) => ({ source, views }))
    .sort((a, b) => b.views - a.views);

  const avgTimeOnPageMs = timings.length
    ? Math.round(timings.reduce((sum, e) => sum + (e.valueMs ?? 0), 0) / timings.length)
    : null;

  return {
    pageViews: pageViews.length,
    uniqueVisitors,
    clicks: clicks.length,
    avgTimeOnPageMs,
    topPaths,
    topClicks,
    topSources,
  };
}

export type TimeseriesPoint = { bucket: string; count: number };

// Admin-only traffic-by-date/hour breakdown — see /api/admin/reports/traffic
// (granularity=hour|day). Never exposed to a non-admin.
export function bucketByTime(timestamps: Date[], granularity: "hour" | "day"): TimeseriesPoint[] {
  const counts = new Map<string, number>();
  for (const t of timestamps) {
    const iso = t.toISOString();
    const key = granularity === "hour" ? `${iso.slice(0, 13)}:00` : iso.slice(0, 10);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([bucket, count]) => ({ bucket, count }))
    .sort((a, b) => a.bucket.localeCompare(b.bucket));
}
