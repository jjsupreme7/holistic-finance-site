"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BlogEditor from "@/components/admin/BlogEditor";

export default function NewBlogPostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSave = async (data: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    status: string;
  }) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json();
        alert(json.error || "Failed to save post.");
        return;
      }

      const { post } = await res.json();
      router.push(`/admin/blog/${post.id}`);
    } catch {
      alert("Failed to save post.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-dark mb-6">New Blog Post</h1>
      <BlogEditor onSave={handleSave} saving={saving} />
    </div>
  );
}
