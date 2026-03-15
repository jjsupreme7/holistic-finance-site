"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TrainingSeriesGroupEditor from "@/components/admin/TrainingSeriesGroupEditor";

export default function NewTrainingModulesPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function handleSave(data: Record<string, unknown>) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/training-modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) {
        alert(json.error || "Failed to create training group.");
        return;
      }

      router.push(`/admin/training-modules/${json.item.id}`);
    } catch {
      alert("Failed to create training group.");
    } finally {
      setSaving(false);
    }
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
          <h1 className="text-2xl font-bold text-dark">Add Training Group</h1>
          <p className="text-text-muted text-sm mt-1">
            Publish the group to make it appear on the public training modules page.
          </p>
        </div>
      </div>

      <TrainingSeriesGroupEditor onSave={handleSave} saving={saving} />
    </div>
  );
}
