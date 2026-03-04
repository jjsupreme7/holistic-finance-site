"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    fetch("/api/admin/campaigns")
      .then((res) => res.json())
      .then((data) => setCampaigns(data.campaigns || []))
      .catch(console.error)
      .finally(() => setLoading(false));
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark">Campaigns</h1>
        <Link
          href="/admin/campaigns/new"
          className="bg-gradient-to-r from-primary to-primary-light text-white font-semibold px-5 py-2.5 rounded-lg no-underline text-sm hover:shadow-lg hover:shadow-primary/25 transition-all"
        >
          New Campaign
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="bg-white rounded-xl border border-border-light p-12 text-center">
          <p className="text-text-muted mb-4">No campaigns yet.</p>
          <Link
            href="/admin/campaigns/new"
            className="text-primary font-semibold no-underline hover:underline text-sm"
          >
            Create your first campaign
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border-light overflow-hidden">
          <table className="w-full text-sm">
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
              {campaigns.map((c) => (
                <tr key={c.id} className="border-b border-border-light last:border-0 hover:bg-[#f8faff] transition-colors">
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
