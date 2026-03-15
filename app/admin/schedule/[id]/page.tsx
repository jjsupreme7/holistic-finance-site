"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import ScheduleEditor from "@/components/admin/ScheduleEditor";

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

export default function EditScheduleItemPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [item, setItem] = useState<ScheduleItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/schedule/${id}`)
      .then((res) => res.json())
      .then((data) => setItem(data.item || null))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSave(data: Record<string, unknown>) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/schedule/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) {
        alert(json.error || "Failed to update schedule item.");
        return;
      }

      setItem(json.item);
      alert("Schedule item saved.");
    } catch {
      alert("Failed to update schedule item.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this schedule item?")) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/schedule/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error();
      }

      router.push("/admin/schedule");
    } catch {
      alert("Failed to delete schedule item.");
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
        <p className="text-text-muted">Schedule item not found.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link
            href="/admin/schedule"
            className="text-primary font-semibold no-underline hover:underline text-sm inline-flex items-center gap-2 mb-2"
          >
            &larr; Back to Schedule
          </Link>
          <h1 className="text-2xl font-bold text-dark">Edit Course or Event</h1>
          <p className="text-text-muted text-sm mt-1">
            Published items are live on the website. Draft items stay private.
          </p>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="bg-white text-red-600 font-semibold px-5 py-2.5 rounded-lg border border-red-200 text-sm hover:bg-red-50 transition-all cursor-pointer disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Delete Item"}
        </button>
      </div>

      <ScheduleEditor
        onSave={handleSave}
        saving={saving}
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
    </div>
  );
}
