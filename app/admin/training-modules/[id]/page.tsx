"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import TrainingSeriesGroupEditor from "@/components/admin/TrainingSeriesGroupEditor";
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

export default function EditTrainingModulesPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [item, setItem] = useState<TrainingSeriesGroupItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/training-modules/${id}`)
      .then((res) => res.json())
      .then((data) => setItem(data.item || null))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSave(data: Record<string, unknown>) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/training-modules/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) {
        alert(json.error || "Failed to update training group.");
        return;
      }

      setItem(json.item);
      alert("Training group saved.");
    } catch {
      alert("Failed to update training group.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this training group?")) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/training-modules/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error();
      }

      router.push("/admin/training-modules");
    } catch {
      alert("Failed to delete training group.");
    } finally {
      setDeleting(false);
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
      <div className="bg-white rounded-xl border border-border-light p-12 text-center">
        <p className="text-text-muted">Training group not found.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link
            href="/admin/training-modules"
            className="text-primary font-semibold no-underline hover:underline text-sm inline-flex items-center gap-2 mb-2"
          >
            &larr; Back to Training Modules
          </Link>
          <h1 className="text-2xl font-bold text-dark">Edit Training Group</h1>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="bg-white text-red-600 font-semibold px-5 py-2.5 rounded-lg border border-red-200 text-sm hover:bg-red-50 transition-all cursor-pointer disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>

      <TrainingSeriesGroupEditor
        onSave={handleSave}
        saving={saving}
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
    </div>
  );
}
