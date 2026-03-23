"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminNotice from "@/components/admin/AdminNotice";
import CampaignEditor from "@/components/admin/CampaignEditor";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useUnsavedChangesGuard } from "@/hooks/use-unsaved-changes-guard";

interface Notice {
  tone: "success" | "error" | "warning" | "info";
  message: string;
}

export default function NewCampaignPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { pendingHref, continueNavigation, stayOnPage } = useUnsavedChangesGuard(hasUnsavedChanges);

  const handleSave = async (data: {
    subject: string;
    bodyHtml: string;
    previewText: string;
  }) => {
    setSaving(true);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save");

      const { campaign } = await res.json();
      router.push(`/admin/campaigns/${campaign.id}`);
    } catch (err) {
      console.error(err);
      setNotice({ tone: "error", message: "Failed to save campaign." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-dark mb-2">Create Email Campaign</h1>
      <p className="text-text-muted text-sm mb-6">
        Save your campaign as a draft first. It will not email subscribers until you send it from
        the campaign page.
      </p>
      {notice && (
        <div className="mb-6">
          <AdminNotice
            tone={notice.tone}
            message={notice.message}
            onDismiss={() => setNotice(null)}
          />
        </div>
      )}
      <CampaignEditor onSave={handleSave} saving={saving} onDirtyChange={setHasUnsavedChanges} />
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
