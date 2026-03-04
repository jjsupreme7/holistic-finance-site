"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  activeSubscribers: number;
  totalSubscribers: number;
  totalCampaigns: number;
  lastCampaign: { subject: string; sent_at: string; recipient_count: number } | null;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [subRes, campRes] = await Promise.all([
          fetch("/api/admin/subscribers"),
          fetch("/api/admin/campaigns"),
        ]);

        const { subscribers } = await subRes.json();
        const { campaigns } = await campRes.json();

        const active = subscribers?.filter((s: { status: string }) => s.status === "active") || [];
        const sentCampaigns = campaigns?.filter((c: { status: string }) => c.status === "sent") || [];
        const lastSent = sentCampaigns.length > 0 ? sentCampaigns[0] : null;

        setStats({
          activeSubscribers: active.length,
          totalSubscribers: subscribers?.length || 0,
          totalCampaigns: campaigns?.length || 0,
          lastCampaign: lastSent,
        });
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-dark mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 border border-border-light">
          <p className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-1">
            Active Subscribers
          </p>
          <p className="text-3xl font-bold text-primary">
            {stats?.activeSubscribers || 0}
          </p>
          <p className="text-text-muted text-xs mt-1">
            of {stats?.totalSubscribers || 0} total
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-border-light">
          <p className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-1">
            Total Campaigns
          </p>
          <p className="text-3xl font-bold text-primary">
            {stats?.totalCampaigns || 0}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-border-light">
          <p className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-1">
            Last Campaign
          </p>
          {stats?.lastCampaign ? (
            <>
              <p className="text-sm font-semibold text-dark truncate">
                {stats.lastCampaign.subject}
              </p>
              <p className="text-text-muted text-xs mt-1">
                Sent to {stats.lastCampaign.recipient_count} &bull;{" "}
                {new Date(stats.lastCampaign.sent_at).toLocaleDateString()}
              </p>
            </>
          ) : (
            <p className="text-text-muted text-sm">No campaigns sent yet</p>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          href="/admin/campaigns/new"
          className="bg-gradient-to-r from-primary to-primary-light text-white font-semibold px-6 py-2.5 rounded-lg no-underline text-sm hover:shadow-lg hover:shadow-primary/25 transition-all"
        >
          New Campaign
        </Link>
        <Link
          href="/admin/subscribers"
          className="bg-white text-primary font-semibold px-6 py-2.5 rounded-lg no-underline text-sm border border-border-light hover:bg-primary/5 transition-all"
        >
          View Subscribers
        </Link>
      </div>
    </div>
  );
}
