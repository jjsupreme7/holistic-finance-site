"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminNotice from "@/components/admin/AdminNotice";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import ScheduleEditor from "@/components/admin/ScheduleEditor";
import { useUnsavedChangesGuard } from "@/hooks/use-unsaved-changes-guard";

interface Notice {
  tone: "success" | "error" | "warning" | "info";
  message: string;
}

export default function NewScheduleItemPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { pendingHref, continueNavigation, stayOnPage } = useUnsavedChangesGuard(hasUnsavedChanges);

  async function handleSave(data: Record<string, unknown>) {
    setSaving(true);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) {
        setNotice({ tone: "error", message: json.error || "Failed to create schedule item." });
        return;
      }

      router.push(`/admin/schedule/${json.item.id}`);
    } catch {
      setNotice({ tone: "error", message: "Failed to create schedule item." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <Link
            href="/admin/schedule"
            className="text-primary font-semibold no-underline hover:underline text-sm inline-flex items-center gap-2 mb-2"
          >
            &larr; Back to Courses &amp; Events
          </Link>
          <h1 className="text-2xl font-bold text-dark">Add Course or Event</h1>
          <p className="text-text-muted text-sm mt-1">
            Choose published to make it visible on the website now, or save it as a draft.
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
      <ScheduleEditor onSave={handleSave} saving={saving} onDirtyChange={setHasUnsavedChanges} />
      <ConfirmDialog
        open={Boolean(pendingHref)}
        title="Leave without saving?"
        description="You have unsaved changes in this course or event. If you leave now, those edits will be lost."
        confirmLabel="Leave page"
        tone="danger"
        onConfirm={continueNavigation}
        onCancel={stayOnPage}
      />
    </div>
  );
}
