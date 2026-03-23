"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

interface Campaign {
  id: string;
  subject: string;
  status: string;
  created_at: string;
  sent_at: string | null;
  recipient_count: number;
}

const statusColors: Record<string, string> = {
  draft: "bg-yellow-50 text-yellow-700",
  sending: "bg-blue-50 text-blue-700",
  sent: "bg-success-bg text-success",
  failed: "bg-red-50 text-red-600",
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "draft" | "sending" | "sent" | "failed"
  >("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "subject">("newest");

  useEffect(() => {
    fetch("/api/admin/campaigns")
      .then((res) => res.json())
      .then((data) => setCampaigns(data.campaigns || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredCampaigns = useMemo(() => {
    const query = search.trim().toLowerCase();

    const visibleCampaigns = campaigns.filter((campaign) => {
      if (statusFilter !== "all" && campaign.status !== statusFilter) {
        return false;
      }

      if (!query) {
        return true;
      }

      return (
        campaign.subject.toLowerCase().includes(query) ||
        campaign.status.toLowerCase().includes(query)
      );
    });

    return [...visibleCampaigns].sort((left, right) => {
      if (sortBy === "subject") {
        return left.subject.localeCompare(right.subject);
      }

      const leftDate = new Date(left.sent_at || left.created_at).getTime();
      const rightDate = new Date(right.sent_at || right.created_at).getTime();

      return sortBy === "oldest" ? leftDate - rightDate : rightDate - leftDate;
    });
  }, [campaigns, search, sortBy, statusFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark">Campaigns</h1>
          <p className="text-text-muted text-sm mt-0.5">
            Save email drafts here. Nothing is sent to subscribers until you explicitly send the
            campaign.
          </p>
        </div>
        <Link
          href="/admin/campaigns/new"
          className="bg-gradient-to-r from-primary to-primary-light text-white font-semibold px-5 py-2.5 rounded-lg no-underline text-sm hover:shadow-lg hover:shadow-primary/25 transition-all"
        >
          Create Email Campaign
        </Link>
      </div>

      {campaigns.length > 0 && (
        <div className="bg-white rounded-2xl border border-border-light p-4 mb-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_180px_180px]">
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Search campaigns</label>
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by subject or status"
                className="w-full px-4 py-3 rounded-xl border-2 border-border-light bg-white text-dark placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as "all" | "draft" | "sending" | "sent" | "failed"
                  )
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-border-light bg-white text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
              >
                <option value="all">All statuses</option>
                <option value="draft">Draft</option>
                <option value="sending">Sending</option>
                <option value="sent">Sent</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Sort by</label>
              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value as "newest" | "oldest" | "subject")
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-border-light bg-white text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="subject">Subject A-Z</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {campaigns.length === 0 ? (
        <div className="bg-white rounded-xl border border-border-light p-12 text-center">
          <p className="text-text-muted mb-4">No campaigns yet.</p>
          <Link
            href="/admin/campaigns/new"
            className="text-primary font-semibold no-underline hover:underline text-sm"
          >
            Create your first email campaign
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border-light overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-border-light bg-[#f8faff]">
                  <th className="text-left px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider">
                    Recipients
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-text-muted">
                      No campaigns match your current filters.
                    </td>
                  </tr>
                ) : (
                  filteredCampaigns.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-border-light last:border-0 hover:bg-[#f8faff] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/campaigns/${c.id}`}
                          className="text-dark font-medium no-underline hover:text-primary transition-colors"
                        >
                          {c.subject}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                            statusColors[c.status] || "bg-gray-50 text-gray-600"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text-muted">
                        {c.recipient_count || "—"}
                      </td>
                      <td className="px-4 py-3 text-text-muted">
                        {c.sent_at
                          ? new Date(c.sent_at).toLocaleDateString()
                          : new Date(c.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
