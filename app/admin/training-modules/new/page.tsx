"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminNotice from "@/components/admin/AdminNotice";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import TrainingSeriesGroupEditor from "@/components/admin/TrainingSeriesGroupEditor";
import { useUnsavedChangesGuard } from "@/hooks/use-unsaved-changes-guard";

interface Notice {
  tone: "success" | "error" | "warning" | "info";
  message: string;
}

export default function NewTrainingModulesPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { pendingHref, continueNavigation, stayOnPage } = useUnsavedChangesGuard(hasUnsavedChanges);

  async function handleSave(data: Record<string, unknown>) {
    setSaving(true);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/training-modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) {
        setNotice({ tone: "error", message: json.error || "Failed to create training group." });
        return;
      }

      router.push(`/admin/training-modules/${json.item.id}`);
    } catch {
      setNotice({ tone: "error", message: "Failed to create training group." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <Link
            href="/admin/training-modules"
            className="text-primary font-semibold no-underline hover:underline text-sm inline-flex items-center gap-2 mb-2"
          >
            &larr; Back to Curriculum
          </Link>
          <h1 className="text-2xl font-bold text-dark">Add Curriculum Group</h1>
          <p className="text-text-muted text-sm mt-1">
            Publish the group to make it appear on the public curriculum page.
          </p>
        </div>
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

      <TrainingSeriesGroupEditor
        onSave={handleSave}
        saving={saving}
        onDirtyChange={setHasUnsavedChanges}
      />
      <ConfirmDialog
        open={Boolean(pendingHref)}
        title="Leave without saving?"
        description="You have unsaved changes in this curriculum group. If you leave now, those edits will be lost."
        confirmLabel="Leave page"
        tone="danger"
        onConfirm={continueNavigation}
        onCancel={stayOnPage}
      />
    </div>
  );
}
