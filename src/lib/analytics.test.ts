import { describe, expect, it } from "vitest";
import { summarizeTraffic, bucketByTime } from "./analytics";

describe("summarizeTraffic", () => {
  it("counts page views and clicks separately", () => {
    const summary = summarizeTraffic([
      { type: "PAGE_VIEW", path: "/", anonId: "a" },
      { type: "PAGE_VIEW", path: "/courses", anonId: "a" },
      { type: "CLICK", path: "/", anonId: "a", label: "quiz-cta" },
    ]);
    expect(summary.pageViews).toBe(2);
    expect(summary.clicks).toBe(1);
  });

  it("counts unique visitors by anonId, not by event count", () => {
    const summary = summarizeTraffic([
      { type: "PAGE_VIEW", path: "/", anonId: "a" },
      { type: "PAGE_VIEW", path: "/", anonId: "a" },
      { type: "PAGE_VIEW", path: "/", anonId: "b" },
    ]);
    expect(summary.uniqueVisitors).toBe(2);
  });

  it("ranks top paths by view count, descending", () => {
    const summary = summarizeTraffic([
      { type: "PAGE_VIEW", path: "/courses", anonId: "a" },
      { type: "PAGE_VIEW", path: "/", anonId: "a" },
      { type: "PAGE_VIEW", path: "/", anonId: "b" },
    ]);
    expect(summary.topPaths[0]).toEqual({ path: "/", views: 2 });
    expect(summary.topPaths[1]).toEqual({ path: "/courses", views: 1 });
  });

  it("ranks top clicks by label, falling back to (unlabeled)", () => {
    const summary = summarizeTraffic([
      { type: "CLICK", path: "/", anonId: "a", label: "quiz-cta" },
      { type: "CLICK", path: "/", anonId: "b", label: "quiz-cta" },
      { type: "CLICK", path: "/", anonId: "c", label: null },
    ]);
    expect(summary.topClicks[0]).toEqual({ label: "quiz-cta", count: 2 });
    expect(summary.topClicks[1]).toEqual({ label: "(unlabeled)", count: 1 });
  });

  it("averages time-on-page across TIME_ON_PAGE events only", () => {
    const summary = summarizeTraffic([
      { type: "TIME_ON_PAGE", path: "/", anonId: "a", valueMs: 1000 },
      { type: "TIME_ON_PAGE", path: "/", anonId: "b", valueMs: 3000 },
      { type: "PAGE_VIEW", path: "/", anonId: "a" },
    ]);
    expect(summary.avgTimeOnPageMs).toBe(2000);
  });

  it("returns null average time when there are no timing events", () => {
    const summary = summarizeTraffic([{ type: "PAGE_VIEW", path: "/", anonId: "a" }]);
    expect(summary.avgTimeOnPageMs).toBeNull();
  });

  it("handles an empty event list", () => {
    const summary = summarizeTraffic([]);
    expect(summary.pageViews).toBe(0);
    expect(summary.uniqueVisitors).toBe(0);
    expect(summary.topPaths).toEqual([]);
  });
});

describe("bucketByTime", () => {
  it("groups timestamps into daily buckets", () => {
    const result = bucketByTime(
      [new Date("2026-09-14T01:00:00Z"), new Date("2026-09-14T23:00:00Z"), new Date("2026-09-13T12:00:00Z")],
      "day"
    );
    expect(result).toEqual([
      { bucket: "2026-09-13", count: 1 },
      { bucket: "2026-09-14", count: 2 },
    ]);
  });

  it("groups timestamps into hourly buckets", () => {
    const result = bucketByTime(
      [new Date("2026-09-14T01:15:00Z"), new Date("2026-09-14T01:45:00Z"), new Date("2026-09-14T02:00:00Z")],
      "hour"
    );
    expect(result).toEqual([
      { bucket: "2026-09-14T01:00", count: 2 },
      { bucket: "2026-09-14T02:00", count: 1 },
    ]);
  });

  it("returns buckets sorted chronologically regardless of input order", () => {
    const result = bucketByTime([new Date("2026-09-14T00:00:00Z"), new Date("2026-09-12T00:00:00Z")], "day");
    expect(result.map((r) => r.bucket)).toEqual(["2026-09-12", "2026-09-14"]);
  });

  it("returns an empty array for no timestamps", () => {
    expect(bucketByTime([], "day")).toEqual([]);
  });
});
