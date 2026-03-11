"use client";

import { useState } from "react";
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
      <h1 className="text-2xl font-bold text-dark mb-6">New Schedule Item</h1>
      <ScheduleEditor onSave={handleSave} saving={saving} />
    </div>
  );
}
