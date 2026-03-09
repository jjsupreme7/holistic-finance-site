"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  activeSubscribers: number;
  totalSubscribers: number;
  totalCampaigns: number;
  totalPosts: number;
  publishedPosts: number;
  lastCampaign: { subject: string; sent_at: string; recipient_count: number } | null;
  pageViews7d: number;
  newSubmissions: number;
  totalSubmissions: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [subRes, campRes, blogRes, analyticsRes, submissionsRes] = await Promise.all([
          fetch("/api/admin/subscribers"),
          fetch("/api/admin/campaigns"),
          fetch("/api/admin/blog"),
          fetch("/api/admin/analytics?range=7").catch(() => null),
          fetch("/api/admin/submissions").catch(() => null),
        ]);

        const { subscribers } = await subRes.json();
        const { campaigns } = await campRes.json();
        const { posts } = await blogRes.json();
        const analyticsData = analyticsRes?.ok ? await analyticsRes.json() : null;
        const submissionsData = submissionsRes?.ok ? await submissionsRes.json() : null;
        const allSubmissions = submissionsData?.submissions || [];
        const newSubs = allSubmissions.filter((s: { status: string }) => s.status === "new");

        const active = subscribers?.filter((s: { status: string }) => s.status === "active") || [];
        const sentCampaigns = campaigns?.filter((c: { status: string }) => c.status === "sent") || [];
        const lastSent = sentCampaigns.length > 0 ? sentCampaigns[0] : null;
        const published = posts?.filter((p: { status: string }) => p.status === "published") || [];

        setStats({
          activeSubscribers: active.length,
          totalSubscribers: subscribers?.length || 0,
          totalCampaigns: campaigns?.length || 0,
          totalPosts: posts?.length || 0,
          publishedPosts: published.length,
          lastCampaign: lastSent,
          pageViews7d: analyticsData?.totalViews || 0,
          newSubmissions: newSubs.length,
          totalSubmissions: allSubmissions.length,
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Link href="/admin/submissions" className="bg-white rounded-xl p-6 border border-border-light no-underline block hover:border-primary/30 transition-colors">
          <p className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-1">
            Contact Submissions
          </p>
          <p className="text-3xl font-bold text-primary">
            {stats?.newSubmissions || 0} <span className="text-lg font-normal text-text-muted">new</span>
          </p>
          <p className="text-text-muted text-xs mt-1">
            {stats?.totalSubmissions || 0} total &rarr;
          </p>
        </Link>

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
            Blog Posts
          </p>
          <p className="text-3xl font-bold text-primary">
            {stats?.publishedPosts || 0}
          </p>
          <p className="text-text-muted text-xs mt-1">
            {stats?.totalPosts || 0} total ({(stats?.totalPosts || 0) - (stats?.publishedPosts || 0)} drafts)
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

        <Link href="/admin/analytics" className="bg-white rounded-xl p-6 border border-border-light no-underline block hover:border-primary/30 transition-colors">
          <p className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-1">
            Page Views (7d)
          </p>
          <p className="text-3xl font-bold text-primary">
            {stats?.pageViews7d || 0}
          </p>
          <p className="text-text-muted text-xs mt-1">
            View full analytics &rarr;
          </p>
        </Link>

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

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/blog/new"
          className="bg-gradient-to-r from-primary to-primary-light text-white font-semibold px-6 py-2.5 rounded-lg no-underline text-sm hover:shadow-lg hover:shadow-primary/25 transition-all"
        >
          Write Blog Post
        </Link>
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
        <Link
          href="/admin/blog"
          className="bg-white text-primary font-semibold px-6 py-2.5 rounded-lg no-underline text-sm border border-border-light hover:bg-primary/5 transition-all"
        >
          Manage Blog
        </Link>
      </div>
    </div>
  );
}
