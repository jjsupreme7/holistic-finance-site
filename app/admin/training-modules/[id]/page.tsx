"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import AdminNotice from "@/components/admin/AdminNotice";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import TrainingSeriesGroupEditor from "@/components/admin/TrainingSeriesGroupEditor";
import { useUnsavedChangesGuard } from "@/hooks/use-unsaved-changes-guard";
import type { TrainingSeriesModule } from "@/lib/training-series";

interface TrainingSeriesGroupItem {
  id: string;
  status: "draft" | "published";
  eyebrow: string;
  title: string;
  description: string;
  accent: string | null;
  modules: TrainingSeriesModule[] | null;
  sort_order: number;
}

interface Notice {
  tone: "success" | "error" | "warning" | "info";
  message: string;
}

export default function EditTrainingModulesPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [item, setItem] = useState<TrainingSeriesGroupItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { pendingHref, continueNavigation, stayOnPage } = useUnsavedChangesGuard(hasUnsavedChanges);

  useEffect(() => {
    fetch(`/api/admin/training-modules/${id}`)
      .then((res) => res.json())
      .then((data) => setItem(data.item || null))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSave(data: Record<string, unknown>) {
    setSaving(true);
    setNotice(null);
    try {
      const res = await fetch(`/api/admin/training-modules/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) {
        setNotice({ tone: "error", message: json.error || "Failed to update training group." });
        return;
      }

      setItem(json.item);
      setNotice({ tone: "success", message: "Training group saved." });
    } catch {
      setNotice({ tone: "error", message: "Failed to update training group." });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setNotice(null);
    try {
      const res = await fetch(`/api/admin/training-modules/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error();
      }

      router.push("/admin/training-modules");
    } catch {
      setNotice({ tone: "error", message: "Failed to delete training group." });
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
        <p className="text-admin-text-secondary">Training group not found.</p>
      </div>
    );
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
          <h1 className="text-2xl font-bold text-admin-text">Edit Curriculum Group</h1>
          <p className="text-admin-text-secondary text-sm mt-1">
            Published groups are live on the website. Draft groups stay private.
          </p>
        </div>
        <button
          onClick={() => setShowDeleteDialog(true)}
          disabled={deleting}
          className="bg-red-900/20 text-red-400 font-semibold px-5 py-2.5 rounded-lg border border-red-800/50 text-sm hover:bg-red-900/30 transition-all cursor-pointer disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Delete Group"}
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

      <TrainingSeriesGroupEditor
        onSave={handleSave}
        saving={saving}
        onDirtyChange={setHasUnsavedChanges}
        initialData={{
          status: item.status,
          eyebrow: item.eyebrow,
          title: item.title,
          description: item.description,
          accent: item.accent,
          sortOrder: item.sort_order,
          modules: item.modules,
        }}
      />
      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete this training group?"
        description="This will remove the curriculum group and its module list from the admin and public site."
        confirmLabel="Delete group"
        tone="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
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
