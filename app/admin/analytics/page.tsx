"use client";

import { useEffect, useState } from "react";

interface AnalyticsData {
  totalViews: number;
  viewsByDay: Record<string, number>;
  bookingClicksTotal: number;
  bookingClicksByDay: Record<string, number>;
  topPages: { path: string; count: number }[];
  topReferrers: { source: string; count: number }[];
  topBookingSources: { path: string; count: number }[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState(7);

  useEffect(() => {
    fetch(`/api/admin/analytics?range=${range}`)
      .then((res) => {
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (json.viewsByDay) setData(json);
      })
      .catch(console.error)
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
    return <p className="text-text-muted">Failed to load analytics.</p>;
  }

  const days = Object.entries(data.viewsByDay);
  const maxViews = Math.max(...days.map(([, v]) => v), 1);
  const bookingDays = Object.entries(data.bookingClicksByDay);
  const maxBookings = Math.max(...bookingDays.map(([, v]) => v), 1);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark">Analytics</h1>
          <p className="text-text-muted text-sm mt-0.5">
            {data.totalViews} total page views and {data.bookingClicksTotal} booking clicks
          </p>
        </div>
        <div className="flex gap-2">
          {[7, 14, 30].map((d) => (
            <button
              key={d}
              onClick={() => {
                setLoading(true);
                setRange(d);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer border-none transition-colors ${
                range === d
                  ? "bg-primary text-white"
                  : "bg-white text-text-light border border-border-light hover:bg-primary/5"
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-border-light p-6">
          <p className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-1">
            Page Views
          </p>
          <p className="text-3xl font-bold text-primary">{data.totalViews}</p>
        </div>
        <div className="bg-white rounded-xl border border-border-light p-6">
          <p className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-1">
            Booking Clicks
          </p>
          <p className="text-3xl font-bold text-primary">{data.bookingClicksTotal}</p>
        </div>
      </div>

      {/* Views Chart */}
      <div className="bg-white rounded-xl border border-border-light p-6 mb-6">
        <p className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-4">
          Page Views
        </p>
        <div className="flex items-end gap-1 h-40">
          {days.map(([day, count]) => (
            <div key={day} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] text-text-muted font-medium">
                {count > 0 ? count : ""}
              </span>
              <div
                className="w-full bg-primary/80 rounded-t transition-all hover:bg-primary"
                style={{
                  height: `${Math.max((count / maxViews) * 100, count > 0 ? 4 : 0)}%`,
                  minHeight: count > 0 ? "4px" : "0px",
                }}
                title={`${day}: ${count} views`}
              />
              <span className="text-[9px] text-text-muted mt-1 hidden sm:block">
                {new Date(day + "T12:00:00").toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border-light p-6 mb-6">
        <p className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-4">
          Booking Clicks
        </p>
        <div className="flex items-end gap-1 h-40">
          {bookingDays.map(([day, count]) => (
            <div key={day} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] text-text-muted font-medium">
                {count > 0 ? count : ""}
              </span>
              <div
                className="w-full bg-primary/80 rounded-t transition-all hover:bg-primary"
                style={{
                  height: `${Math.max((count / maxBookings) * 100, count > 0 ? 4 : 0)}%`,
                  minHeight: count > 0 ? "4px" : "0px",
                }}
                title={`${day}: ${count} booking clicks`}
              />
              <span className="text-[9px] text-text-muted mt-1 hidden sm:block">
                {new Date(day + "T12:00:00").toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Top Pages */}
        <div className="bg-white rounded-xl border border-border-light overflow-hidden">
          <div className="px-4 py-3 border-b border-border-light bg-[#f8faff]">
            <p className="text-text-muted text-xs font-semibold uppercase tracking-wider">
              Top Pages
            </p>
          </div>
          {data.topPages.length === 0 ? (
            <p className="px-4 py-8 text-center text-text-muted text-sm">
              No page views yet.
            </p>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {data.topPages.map((p) => (
                  <tr
                    key={p.path}
                    className="border-b border-border-light last:border-0 hover:bg-[#f8faff] transition-colors"
                  >
                    <td className="px-4 py-3 text-dark font-medium">{p.path}</td>
                    <td className="px-4 py-3 text-right text-text-muted">
                      {p.count} <span className="text-xs">views</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-white rounded-xl border border-border-light overflow-hidden">
          <div className="px-4 py-3 border-b border-border-light bg-[#f8faff]">
            <p className="text-text-muted text-xs font-semibold uppercase tracking-wider">
              Booking Sources
            </p>
          </div>
          {data.topBookingSources.length === 0 ? (
            <p className="px-4 py-8 text-center text-text-muted text-sm">
              No booking clicks yet.
            </p>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {data.topBookingSources.map((source) => (
                  <tr
                    key={source.path}
                    className="border-b border-border-light last:border-0 hover:bg-[#f8faff] transition-colors"
                  >
                    <td className="px-4 py-3 text-dark font-medium">{source.path}</td>
                    <td className="px-4 py-3 text-right text-text-muted">
                      {source.count} <span className="text-xs">clicks</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Top Referrers */}
        <div className="bg-white rounded-xl border border-border-light overflow-hidden">
          <div className="px-4 py-3 border-b border-border-light bg-[#f8faff]">
            <p className="text-text-muted text-xs font-semibold uppercase tracking-wider">
              Top Referrers
            </p>
          </div>
          {data.topReferrers.length === 0 ? (
            <p className="px-4 py-8 text-center text-text-muted text-sm">
              No referrer data yet.
            </p>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {data.topReferrers.map((r) => (
                  <tr
                    key={r.source}
                    className="border-b border-border-light last:border-0 hover:bg-[#f8faff] transition-colors"
                  >
                    <td className="px-4 py-3 text-dark font-medium">{r.source}</td>
                    <td className="px-4 py-3 text-right text-text-muted">
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
