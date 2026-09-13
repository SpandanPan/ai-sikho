"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type Traffic = {
  days: number;
  pageViews: number;
  uniqueVisitors: number;
  clicks: number;
  avgTimeOnPageMs: number | null;
  topPaths: { path: string; views: number }[];
  topClicks: { label: string; count: number }[];
};

type Accounting = {
  summary: {
    revenueInPaise: number;
    refundsInPaise: number;
    platformFeesInPaise: number;
    expensesInPaise: number;
    netProfitInPaise: number;
  };
  perUser: { userId: string; email: string | null; phone: string | null; revenueInPaise: number; costInPaise: number; profitInPaise: number }[];
  entryCount: number;
};

function inr(paise: number) {
  return `₹${(paise / 100).toFixed(2)}`;
}

export default function AdminReportsPage() {
  const { status } = useSession();
  const [traffic, setTraffic] = useState<Traffic | null>(null);
  const [accounting, setAccounting] = useState<Accounting | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/admin/reports/traffic").then((r) => (r.ok ? r.json() : Promise.reject(r))).then(setTraffic).catch(() => setError("Admin only, or not signed in."));
    fetch("/api/admin/reports/accounting").then((r) => (r.ok ? r.json() : Promise.reject(r))).then(setAccounting).catch(() => {});
  }, [status]);

  if (status === "loading") return null;
  if (status !== "authenticated") {
    return (
      <main className="mx-auto max-w-lg px-5 py-16">
        <a href="/signin?callbackUrl=/admin/reports" className="text-sm text-accent-ink underline">Sign in →</a>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-2">Admin</p>
      <h1 className="font-display text-2xl font-semibold mb-8">Reports</h1>
      {error && <p className="text-sm text-rust mb-6">{error}</p>}

      <section className="mb-10">
        <h2 className="font-semibold text-sm mb-3">Traffic (last {traffic?.days ?? "…"} days)</h2>
        {traffic ? (
          <>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="border border-paper-line rounded p-3">
                <div className="font-mono text-[10.5px] uppercase text-ink-soft">Page views</div>
                <div className="font-display text-xl">{traffic.pageViews}</div>
              </div>
              <div className="border border-paper-line rounded p-3">
                <div className="font-mono text-[10.5px] uppercase text-ink-soft">Unique visitors</div>
                <div className="font-display text-xl">{traffic.uniqueVisitors}</div>
              </div>
              <div className="border border-paper-line rounded p-3">
                <div className="font-mono text-[10.5px] uppercase text-ink-soft">Avg. time on page</div>
                <div className="font-display text-xl">
                  {traffic.avgTimeOnPageMs ? `${Math.round(traffic.avgTimeOnPageMs / 1000)}s` : "—"}
                </div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="font-mono text-[10.5px] uppercase text-ink-soft mb-1.5">Top pages</p>
                {traffic.topPaths.slice(0, 8).map((p) => (
                  <div key={p.path} className="flex justify-between text-xs py-1 border-t border-paper-line first:border-t-0">
                    <span className="font-mono">{p.path}</span><span>{p.views}</span>
                  </div>
                ))}
              </div>
              <div>
                <p className="font-mono text-[10.5px] uppercase text-ink-soft mb-1.5">Top clicks</p>
                {traffic.topClicks.slice(0, 8).map((c) => (
                  <div key={c.label} className="flex justify-between text-xs py-1 border-t border-paper-line first:border-t-0">
                    <span className="font-mono">{c.label}</span><span>{c.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm text-ink-soft">Loading…</p>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm">Accounting (all time)</h2>
          <a href="/api/admin/reports/accounting?format=csv" className="font-mono text-[11px] border border-paper-line rounded px-2.5 py-1.5">
            Download CSV for CA →
          </a>
        </div>
        {accounting ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
              {([
                ["Revenue", accounting.summary.revenueInPaise],
                ["Refunds", accounting.summary.refundsInPaise],
                ["Platform fees", accounting.summary.platformFeesInPaise],
                ["Expenses", accounting.summary.expensesInPaise],
                ["Net profit", accounting.summary.netProfitInPaise],
              ] as const).map(([label, val]) => (
                <div key={label} className="border border-paper-line rounded p-3">
                  <div className="font-mono text-[10px] uppercase text-ink-soft">{label}</div>
                  <div className={`font-display text-lg ${label === "Net profit" ? "text-accent-ink" : ""}`}>{inr(val)}</div>
                </div>
              ))}
            </div>
            <p className="font-mono text-[10.5px] uppercase text-ink-soft mb-1.5">Per customer</p>
            <div className="flex flex-col gap-1">
              {accounting.perUser.map((u) => (
                <div key={u.userId} className="flex justify-between text-xs border-t border-paper-line py-1.5">
                  <span>{u.email ?? u.phone ?? u.userId}</span>
                  <span className="font-mono">
                    rev {inr(u.revenueInPaise)} · cost {inr(u.costInPaise)} · profit {inr(u.profitInPaise)}
                  </span>
                </div>
              ))}
              {accounting.perUser.length === 0 && <p className="text-xs text-ink-soft">No paid transactions yet.</p>}
            </div>
          </>
        ) : (
          <p className="text-sm text-ink-soft">Loading…</p>
        )}
      </section>
    </main>
  );
}
