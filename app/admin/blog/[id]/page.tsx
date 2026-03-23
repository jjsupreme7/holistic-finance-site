"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminNotice from "@/components/admin/AdminNotice";
import BlogEditor from "@/components/admin/BlogEditor";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useUnsavedChangesGuard } from "@/hooks/use-unsaved-changes-guard";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
}

interface Notice {
  tone: "success" | "error" | "warning" | "info";
  message: string;
}

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { pendingHref, continueNavigation, stayOnPage } = useUnsavedChangesGuard(hasUnsavedChanges);

  useEffect(() => {
    fetch(`/api/admin/blog/${id}`)
      .then((res) => res.json())
      .then((data) => setPost(data.post || null))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

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
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json();
        setNotice({ tone: "error", message: json.error || "Failed to update post." });
        return;
      }

      const { post: updated } = await res.json();
      setPost(updated);
      setNotice({ tone: "success", message: "Post saved." });
    } catch {
      setNotice({ tone: "error", message: "Failed to update post." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setNotice(null);
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      router.push("/admin/blog");
    } catch {
      setNotice({ tone: "error", message: "Failed to delete post." });
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-white rounded-xl border border-border-light p-12 text-center">
        <p className="text-text-muted">Post not found.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark">Edit Blog Post</h1>
        <div className="flex flex-wrap gap-3">
          {post.status === "published" && (
            <a
              href={`/blog/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-primary font-semibold px-5 py-2.5 rounded-lg border border-border-light no-underline text-sm hover:bg-primary/5 transition-all"
            >
              View Live Post
            </a>
          )}
          <button
            onClick={() => setShowDeleteDialog(true)}
            disabled={deleting}
            className="bg-white text-red-600 font-semibold px-5 py-2.5 rounded-lg border border-red-200 text-sm hover:bg-red-50 transition-all cursor-pointer disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete Post"}
          </button>
        </div>
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
      <BlogEditor
        onSave={handleSave}
        saving={saving}
        onDirtyChange={setHasUnsavedChanges}
        initialData={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || "",
          content: post.content,
          coverImage: post.cover_image || "",
          status: post.status,
        }}
      />
      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete this post?"
        description="This removes the article from the admin and public blog. This action cannot be undone."
        confirmLabel="Delete post"
        tone="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
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
