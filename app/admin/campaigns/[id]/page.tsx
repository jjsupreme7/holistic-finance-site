"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import CampaignEditor from "@/components/admin/CampaignEditor";

interface Campaign {
  id: string;
  subject: string;
  body_html: string;
  preview_text: string | null;
  status: string;
  sent_at: string | null;
  recipient_count: number;
}

export default function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/campaigns/${id}`)
      .then((res) => res.json())
      .then((data) => setCampaign(data.campaign))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async (data: {
    subject: string;
    bodyHtml: string;
    previewText: string;
  }) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/campaigns/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save");

      const { campaign: updated } = await res.json();
      setCampaign(updated);
    } catch (err) {
      console.error(err);
      alert("Failed to save campaign.");
    } finally {
      setSaving(false);
    }
  };

  const handleSend = async () => {
    if (!confirm("Send this campaign to all active subscribers?")) return;

    setSending(true);
    try {
      const res = await fetch(`/api/admin/campaigns/${id}/send`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to send.");
        return;
      }

      alert(data.message);
      router.push("/admin/campaigns");
    } catch (err) {
      console.error(err);
      alert("Failed to send campaign.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!campaign) {
    return <p className="text-text-muted">Campaign not found.</p>;
  }

  const isSent = campaign.status === "sent";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark">
            {isSent ? "Campaign Details" : "Edit Campaign"}
          </h1>
          {isSent && (
            <p className="text-text-muted text-sm mt-0.5">
              Sent to {campaign.recipient_count} subscribers on{" "}
              {new Date(campaign.sent_at!).toLocaleDateString()}
            </p>
          )}
        </div>
        {!isSent && (
          <button
            onClick={handleSend}
            disabled={sending}
            className="bg-gradient-to-r from-gold to-gold-dark text-dark font-bold px-6 py-2.5 rounded-lg text-sm cursor-pointer border-none hover:shadow-lg hover:shadow-gold/25 transition-all disabled:opacity-60"
          >
            {sending ? "Sending..." : "Send to All Subscribers"}
          </button>
        )}
      </div>

      <CampaignEditor
        initialSubject={campaign.subject}
        initialBodyHtml={campaign.body_html}
        initialPreviewText={campaign.preview_text || ""}
        onSave={handleSave}
        saving={saving}
        readOnly={isSent}
      />
    </div>
  );
}
