"use client";

import { useEffect, useState } from "react";
import AdminNotice from "@/components/admin/AdminNotice";
import BarChart from "@/components/admin/BarChart";

interface AnalyticsData {
  trackingConfigured: boolean;
  missingTables: string[];
  totalViews: number;
  uniqueVisitors: number;
  viewsByDay: Record<string, number>;
  uniqueVisitorsByDay: Record<string, number>;
  deviceBreakdown: Record<string, number>;
  browserBreakdown: Record<string, number>;
  bookingClicksTotal: number;
  bookingClicksByDay: Record<string, number>;
  topPages: { path: string; count: number }[];
  topReferrers: { source: string; count: number }[];
  topBookingSources: { path: string; count: number }[];
  totalSubscribers: number;
  newSubscribers: number;
  subscribersByDay: Record<string, number>;
  totalSubmissions: number;
  newSubmissions: number;
  submissionsByDay: Record<string, number>;
  contactConversionRate: number;
}

function StatCard({
  label,
  value,
  subtext,
}: {
  label: string;
  value: string | number;
  subtext?: string;
}) {
  return (
    <div className="bg-admin-card rounded-xl border border-border-light p-5">
      <p className="text-admin-text-secondary text-xs font-semibold uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-2xl font-bold text-primary">{value}</p>
      {subtext && (
        <p className="text-admin-text-secondary text-xs mt-0.5">{subtext}</p>
      )}
    </div>
  );
}

function PercentageBar({
  label,
  count,
  total,
}: {
  label: string;
  count: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3 mb-3 last:mb-0">
      <span className="text-sm text-admin-text font-medium w-16 shrink-0">
        {label}
      </span>
      <div className="flex-1 bg-primary/10 rounded h-5 overflow-hidden">
        <div
          className="bg-primary/70 h-full rounded"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm text-admin-text-secondary w-20 text-right shrink-0">
        {pct}% ({count})
      </span>
    </div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState(7);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/analytics?range=${range}`)
      .then(async (res) => {
        const json = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(json?.error || `API error: ${res.status}`);
        }
        return json;
      })
      .then((json) => {
        if (json.viewsByDay) {
          setData(json);
          setErrorMessage(null);
        }
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load analytics.",
        );
      })
      .finally(() => setLoading(false));
  }, [range]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-4">
        <p className="text-admin-text-secondary">Failed to load analytics.</p>
        {errorMessage && <AdminNotice tone="error" message={errorMessage} />}
      </div>
    );
  }

  const deviceTotal = Object.values(data.deviceBreakdown).reduce(
    (a, b) => a + b,
    0,
  );
  const browserEntries = Object.entries(data.browserBreakdown).sort(
    (a, b) => b[1] - a[1],
  );
  const browserTotal = browserEntries.reduce((a, [, v]) => a + v, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-admin-text">Analytics</h1>
          <p className="text-admin-text-secondary text-sm mt-0.5">
            Traffic, engagement, and growth metrics
          </p>
        </div>
        <div className="flex gap-2">
          {[7, 14, 30].map((d) => (
            <button
              key={d}
              onClick={() => {
                setLoading(true);
                setErrorMessage(null);
                setRange(d);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer border-none transition-colors ${
                range === d
                  ? "bg-primary text-white"
                  : "bg-admin-surface text-text-light border border-border-light hover:bg-primary/10"
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {!data.trackingConfigured && (
        <div className="mb-6">
          <AdminNotice
            tone="warning"
            message={`Analytics tracking is not fully configured yet. Missing table${data.missingTables.length === 1 ? "" : "s"}: ${data.missingTables.join(", ")}. Run the tracking SQL in supabase-schema.sql, then reload this page.`}
          />
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <StatCard
          label="Page Views"
          value={data.totalViews}
          subtext={`${range}d total`}
        />
        <StatCard
          label="Unique Visitors"
          value={data.uniqueVisitors}
          subtext={`${range}d unique`}
        />
        <StatCard
          label="Booking Clicks"
          value={data.bookingClicksTotal}
          subtext={`${range}d clicks`}
        />
        <StatCard
          label="Subscribers"
          value={data.totalSubscribers}
          subtext={`+${data.newSubscribers} in ${range}d`}
        />
        <StatCard
          label="Submissions"
          value={data.totalSubmissions}
          subtext={`+${data.newSubmissions} in ${range}d`}
        />
        <StatCard
          label="Contact Conv."
          value={`${data.contactConversionRate}%`}
          subtext="visits → submissions"
        />
      </div>

      {/* Page Views + Unique Visitors chart */}
      <BarChart
        title="Page Views"
        data={data.viewsByDay}
        overlay={data.uniqueVisitorsByDay}
        mainLabel="Total views"
        overlayLabel="Unique visitors"
        overlayColor="bg-blue-400/60"
        unitLabel="views"
      />

      {/* Booking Clicks chart */}
      <BarChart
        title="Booking Clicks"
        data={data.bookingClicksByDay}
        unitLabel="clicks"
      />

      {/* Device + Browser breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-admin-card rounded-xl border border-border-light p-6">
          <p className="text-admin-text-secondary text-xs font-semibold uppercase tracking-wider mb-4">
            Device Breakdown
          </p>
          {deviceTotal === 0 ? (
            <p className="text-admin-text-secondary text-sm">No data yet.</p>
          ) : (
            <>
              <PercentageBar
                label="Desktop"
                count={data.deviceBreakdown.desktop || 0}
                total={deviceTotal}
              />
              <PercentageBar
                label="Mobile"
                count={data.deviceBreakdown.mobile || 0}
                total={deviceTotal}
              />
              <PercentageBar
                label="Tablet"
                count={data.deviceBreakdown.tablet || 0}
                total={deviceTotal}
              />
            </>
          )}
        </div>

        <div className="bg-admin-card rounded-xl border border-border-light p-6">
          <p className="text-admin-text-secondary text-xs font-semibold uppercase tracking-wider mb-4">
            Browser Breakdown
          </p>
          {browserTotal === 0 ? (
            <p className="text-admin-text-secondary text-sm">No data yet.</p>
          ) : (
            browserEntries.map(([browser, count]) => (
              <PercentageBar
                key={browser}
                label={browser}
                count={count}
                total={browserTotal}
              />
            ))
          )}
        </div>
      </div>

      {/* Subscriber + Submission growth */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <BarChart
          title="New Subscribers"
          data={data.subscribersByDay}
          color="bg-green-400/70"
          hoverColor="bg-green-500"
          unitLabel="subscribers"
        />
        <BarChart
          title="Contact Submissions"
          data={data.submissionsByDay}
          color="bg-amber-400/70"
          hoverColor="bg-amber-500"
          unitLabel="submissions"
        />
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Top Pages */}
        <div className="bg-admin-card rounded-xl border border-border-light overflow-hidden">
          <div className="px-4 py-3 border-b border-border-light bg-admin-surface">
            <p className="text-admin-text-secondary text-xs font-semibold uppercase tracking-wider">
              Top Pages
            </p>
          </div>
          {data.topPages.length === 0 ? (
            <p className="px-4 py-8 text-center text-admin-text-secondary text-sm">
              No page views yet.
            </p>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {data.topPages.map((p) => (
                  <tr
                    key={p.path}
                    className="border-b border-border-light last:border-0 hover:bg-admin-hover transition-colors"
                  >
                    <td className="px-4 py-3 text-admin-text font-medium">
                      {p.path}
                    </td>
                    <td className="px-4 py-3 text-right text-admin-text-secondary">
                      {p.count} <span className="text-xs">views</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Booking Sources */}
        <div className="bg-admin-card rounded-xl border border-border-light overflow-hidden">
          <div className="px-4 py-3 border-b border-border-light bg-admin-surface">
            <p className="text-admin-text-secondary text-xs font-semibold uppercase tracking-wider">
              Booking Sources
            </p>
          </div>
          {data.topBookingSources.length === 0 ? (
            <p className="px-4 py-8 text-center text-admin-text-secondary text-sm">
              No booking clicks yet.
            </p>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {data.topBookingSources.map((source) => (
                  <tr
                    key={source.path}
                    className="border-b border-border-light last:border-0 hover:bg-admin-hover transition-colors"
                  >
                    <td className="px-4 py-3 text-admin-text font-medium">
                      {source.path}
                    </td>
                    <td className="px-4 py-3 text-right text-admin-text-secondary">
                      {source.count} <span className="text-xs">clicks</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Top Referrers */}
        <div className="bg-admin-card rounded-xl border border-border-light overflow-hidden">
          <div className="px-4 py-3 border-b border-border-light bg-admin-surface">
            <p className="text-admin-text-secondary text-xs font-semibold uppercase tracking-wider">
              Top Referrers
            </p>
          </div>
          {data.topReferrers.length === 0 ? (
            <p className="px-4 py-8 text-center text-admin-text-secondary text-sm">
              No referrer data yet.
            </p>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {data.topReferrers.map((r) => (
                  <tr
                    key={r.source}
                    className="border-b border-border-light last:border-0 hover:bg-admin-hover transition-colors"
                  >
                    <td className="px-4 py-3 text-admin-text font-medium">
                      {r.source}
                    </td>
                    <td className="px-4 py-3 text-right text-admin-text-secondary">
                      {r.count} <span className="text-xs">visits</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
