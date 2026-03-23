"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminNotice from "@/components/admin/AdminNotice";
import BlogEditor from "@/components/admin/BlogEditor";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useUnsavedChangesGuard } from "@/hooks/use-unsaved-changes-guard";

interface Notice {
  tone: "success" | "error" | "warning" | "info";
  message: string;
}

export default function NewBlogPostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { pendingHref, continueNavigation, stayOnPage } = useUnsavedChangesGuard(hasUnsavedChanges);

  const handleSave = async (data: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    status: string;
  }) => {
    setSaving(true);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json();
        setNotice({ tone: "error", message: json.error || "Failed to save post." });
        return;
      }

      const { post } = await res.json();
      router.push(`/admin/blog/${post.id}`);
    } catch {
      setNotice({ tone: "error", message: "Failed to save post." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-dark mb-6">New Blog Post</h1>
      {notice && (
        <div className="mb-6">
          <AdminNotice
            tone={notice.tone}
            message={notice.message}
            onDismiss={() => setNotice(null)}
          />
        </div>
      )}
      <BlogEditor
        onSave={handleSave}
        saving={saving}
        defaultStatus="published"
        onDirtyChange={setHasUnsavedChanges}
      />
      <ConfirmDialog
        open={Boolean(pendingHref)}
        title="Leave without saving?"
        description="You have unsaved changes in this blog post. If you leave now, those edits will be lost."
        confirmLabel="Leave page"
        tone="danger"
        onConfirm={continueNavigation}
        onCancel={stayOnPage}
      />
    </div>
  );
}
