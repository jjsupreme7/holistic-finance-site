"use client";

import { useEffect, useState, use } from "react";
import AdminNotice from "@/components/admin/AdminNotice";
import CampaignEditor from "@/components/admin/CampaignEditor";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useUnsavedChangesGuard } from "@/hooks/use-unsaved-changes-guard";

interface Campaign {
  id: string;
  subject: string;
  body_html: string;
  preview_text: string | null;
  status: string;
  sent_at: string | null;
  recipient_count: number;
}

interface Notice {
  tone: "success" | "error" | "warning" | "info";
  message: string;
}

export default function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const { pendingHref, continueNavigation, stayOnPage } = useUnsavedChangesGuard(hasUnsavedChanges);

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
    setNotice(null);
    try {
      const res = await fetch(`/api/admin/campaigns/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to save");
      }

      setCampaign(json.campaign);
      setNotice({ tone: "success", message: "Campaign draft saved." });
    } catch (err) {
      console.error(err);
      setNotice({
        tone: "error",
        message: err instanceof Error ? err.message : "Failed to save campaign.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSend = async () => {
    setSending(true);
    setNotice(null);
    try {
      const res = await fetch(`/api/admin/campaigns/${id}/send`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        setNotice({ tone: "error", message: data.error || "Failed to send." });
        return;
      }

      setNotice({ tone: "success", message: data.message });
      const refreshed = await fetch(`/api/admin/campaigns/${id}`).then((response) => response.json());
      setCampaign(refreshed.campaign || null);
    } catch (err) {
      console.error(err);
      setNotice({ tone: "error", message: "Failed to send campaign." });
    } finally {
      setSending(false);
      setShowSendDialog(false);
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
  const isLocked =
    campaign.status === "sent" ||
    campaign.status === "sending" ||
    (campaign.status === "failed" && campaign.recipient_count > 0);
  const canSend =
    campaign.status === "draft" ||
    (campaign.status === "failed" && campaign.recipient_count === 0);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
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
          {campaign.status === "sending" && (
            <p className="text-text-muted text-sm mt-0.5">
              This campaign is currently sending. Editing is temporarily locked.
            </p>
          )}
          {campaign.status === "failed" && campaign.recipient_count === 0 && (
            <p className="text-red-600 text-sm mt-0.5">
              The last send failed before any emails were delivered. You can edit and try again.
            </p>
          )}
          {campaign.status === "failed" && campaign.recipient_count > 0 && (
            <p className="text-red-600 text-sm mt-0.5">
              This campaign was only partially delivered to {campaign.recipient_count} subscribers.
              It is locked to avoid duplicate sends.
            </p>
          )}
        </div>
        {canSend && (
          <button
            onClick={() => setShowSendDialog(true)}
            disabled={sending || saving}
            className="bg-gradient-to-r from-gold to-gold-dark text-dark font-bold px-6 py-2.5 rounded-lg text-sm cursor-pointer border-none hover:shadow-lg hover:shadow-gold/25 transition-all disabled:opacity-60"
          >
            {sending
              ? "Sending Campaign..."
              : campaign.status === "failed"
                ? "Retry Send to Subscribers"
                : "Send Campaign to Subscribers"}
          </button>
        )}
      </div>
      {notice && (
        <div className="mb-6">
          <AdminNotice
            tone={notice.tone}
            message={notice.message}
            onDismiss={() => setNotice(null)}
          />
        </div>
      )}

      <CampaignEditor
        initialSubject={campaign.subject}
        initialBodyHtml={campaign.body_html}
        initialPreviewText={campaign.preview_text || ""}
        onSave={handleSave}
        saving={saving}
        readOnly={isLocked}
        onDirtyChange={setHasUnsavedChanges}
      />
      <ConfirmDialog
        open={showSendDialog}
        title="Send this campaign?"
        description="This will send the campaign to all active subscribers. You should only continue if the subject, preview text, and email body are final."
        confirmLabel="Send campaign"
        loading={sending}
        onConfirm={handleSend}
        onCancel={() => setShowSendDialog(false)}
      />
      <ConfirmDialog
        open={Boolean(pendingHref)}
        title="Leave without saving?"
        description="You have unsaved changes in this email campaign. If you leave now, those edits will be lost."
        confirmLabel="Leave page"
        tone="danger"
        onConfirm={continueNavigation}
        onCancel={stayOnPage}
      />
    </div>
  );
}
