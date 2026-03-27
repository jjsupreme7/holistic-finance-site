"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import AdminNotice from "@/components/admin/AdminNotice";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import ScheduleEditor from "@/components/admin/ScheduleEditor";
import { useUnsavedChangesGuard } from "@/hooks/use-unsaved-changes-guard";

interface ScheduleItem {
  id: string;
  kind: "course" | "event";
  status: "draft" | "published";
  title: string;
  icon: string | null;
  schedule_type: string | null;
  price_label: string | null;
  duration: string | null;
  format: string | null;
  date_label: string;
  time_label: string | null;
  description: string;
  location: string | null;
  highlights: string[] | null;
  sponsor: string | null;
  contact_label: string | null;
  sort_order: number;
}

interface Notice {
  tone: "success" | "error" | "warning" | "info";
  message: string;
}

export default function EditScheduleItemPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [item, setItem] = useState<ScheduleItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { pendingHref, continueNavigation, stayOnPage } = useUnsavedChangesGuard(hasUnsavedChanges);

  useEffect(() => {
    fetch(`/api/admin/schedule/${id}`)
      .then((res) => res.json())
      .then((data) => setItem(data.item || null))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSave(data: Record<string, unknown>) {
    setSaving(true);
    setNotice(null);
    try {
      const res = await fetch(`/api/admin/schedule/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) {
        setNotice({ tone: "error", message: json.error || "Failed to update course or event." });
        return;
      }

      setItem(json.item);
      setNotice({ tone: "success", message: "Course or event saved." });
    } catch {
      setNotice({ tone: "error", message: "Failed to update course or event." });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setNotice(null);
    try {
      const res = await fetch(`/api/admin/schedule/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error();
      }

      router.push("/admin/schedule");
    } catch {
      setNotice({ tone: "error", message: "Failed to delete this course or event." });
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="bg-admin-card rounded-xl border border-border-light p-12 text-center">
        <p className="text-admin-text-secondary">Schedule item not found.</p>
      </div>
    );
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
          <h1 className="text-2xl font-bold text-admin-text">Edit Course or Event</h1>
          <p className="text-admin-text-secondary text-sm mt-1">
            Published items are live on the website. Draft items stay private.
          </p>
        </div>
        <button
          onClick={() => setShowDeleteDialog(true)}
          disabled={deleting}
          className="bg-red-900/20 text-red-400 font-semibold px-5 py-2.5 rounded-lg border border-red-800/50 text-sm hover:bg-red-900/30 transition-all cursor-pointer disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Delete Item"}
        </button>
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

      <ScheduleEditor
        onSave={handleSave}
        saving={saving}
        onDirtyChange={setHasUnsavedChanges}
        initialData={{
          kind: item.kind,
          status: item.status,
          title: item.title,
          icon: item.icon,
          scheduleType: item.schedule_type,
          priceLabel: item.price_label,
          duration: item.duration,
          format: item.format,
          dateLabel: item.date_label,
          timeLabel: item.time_label,
          description: item.description,
          location: item.location,
          sponsor: item.sponsor,
          contactLabel: item.contact_label,
          highlights: item.highlights,
          sortOrder: item.sort_order,
        }}
      />
      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete this course or event?"
        description="This will remove the item from the admin and public schedule."
        confirmLabel="Delete item"
        tone="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
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
