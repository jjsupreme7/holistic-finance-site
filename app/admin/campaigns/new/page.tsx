"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CampaignEditor from "@/components/admin/CampaignEditor";

export default function NewCampaignPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSave = async (data: {
    subject: string;
    bodyHtml: string;
    previewText: string;
  }) => {
    setSaving(true);
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
      alert("Failed to save campaign.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-dark mb-6">New Campaign</h1>
      <CampaignEditor onSave={handleSave} saving={saving} />
    </div>
  );
}
