"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ScheduleEditor from "@/components/admin/ScheduleEditor";

export default function NewScheduleItemPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function handleSave(data: Record<string, unknown>) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) {
        alert(json.error || "Failed to create schedule item.");
        return;
      }

      router.push(`/admin/schedule/${json.item.id}`);
    } catch {
      alert("Failed to create schedule item.");
    } finally {
      setSaving(false);
    }
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
          <h1 className="text-2xl font-bold text-dark">Add Course or Event</h1>
          <p className="text-text-muted text-sm mt-1">
            Choose published to make it visible on the website now, or save it as a draft.
          </p>
        </div>
      </div>
      <ScheduleEditor onSave={handleSave} saving={saving} />
    </div>
  );
}
