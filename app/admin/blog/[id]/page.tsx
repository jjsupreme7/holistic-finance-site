"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import BlogEditor from "@/components/admin/BlogEditor";

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

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json();
        alert(json.error || "Failed to update post.");
        return;
      }

      const { post: updated } = await res.json();
      setPost(updated);
      alert("Post saved!");
    } catch {
      alert("Failed to update post.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      router.push("/admin/blog");
    } catch {
      alert("Failed to delete post.");
    } finally {
      setDeleting(false);
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark">Edit Blog Post</h1>
        <div className="flex gap-3">
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
            onClick={handleDelete}
            disabled={deleting}
            className="bg-white text-red-600 font-semibold px-5 py-2.5 rounded-lg border border-red-200 text-sm hover:bg-red-50 transition-all cursor-pointer disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete Post"}
          </button>
        </div>
      </div>
      <BlogEditor
        onSave={handleSave}
        saving={saving}
        initialData={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || "",
          content: post.content,
          coverImage: post.cover_image || "",
          status: post.status,
        }}
      />
    </div>
  );
}
