"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AdminNotice from "@/components/admin/AdminNotice";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

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
  tone: "success" | "error";
  message: string;
}

const statusColors: Record<string, string> = {
  draft: "bg-yellow-50 text-yellow-700",
  published: "bg-success-bg text-success",
};

function formatDate(dateString: string | null) {
  if (!dateString) return "Not published yet";

  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [pendingDraftPost, setPendingDraftPost] = useState<BlogPost | null>(null);
  const [pendingDeletePost, setPendingDeletePost] = useState<BlogPost | null>(null);

  useEffect(() => {
    async function loadPosts() {
      try {
        const res = await fetch("/api/admin/blog");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load blog posts.");
        }

        setPosts(data.posts || []);
      } catch (error) {
        console.error(error);
        setNotice({
          tone: "error",
          message: "Could not load blog posts.",
        });
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return posts;

    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.slug.toLowerCase().includes(query) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(query))
    );
  }, [posts, search]);

  const draftPosts = filteredPosts.filter((post) => post.status === "draft");
  const publishedPosts = filteredPosts.filter((post) => post.status === "published");
  const totalDrafts = posts.filter((post) => post.status === "draft").length;
  const totalPublished = posts.filter((post) => post.status === "published").length;

  const handleStatusChange = async (post: BlogPost, nextStatus: "draft" | "published") => {
    setSavingId(post.id);
    setNotice(null);

    try {
      const res = await fetch(`/api/admin/blog/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || "",
          content: post.content,
          coverImage: post.cover_image || "",
          status: nextStatus,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update post.");
      }

      setPosts((current) =>
        current.map((currentPost) => (currentPost.id === post.id ? data.post : currentPost))
      );
      setNotice({
        tone: "success",
        message:
          nextStatus === "published"
            ? `"${post.title}" is now live on your website.`
            : `"${post.title}" was moved back to draft.`,
      });
    } catch (error) {
      console.error(error);
      setNotice({
        tone: "error",
        message:
          error instanceof Error ? error.message : "Failed to update the post status.",
      });
    } finally {
      setSavingId(null);
      if (nextStatus === "draft") {
        setPendingDraftPost(null);
      }
    }
  };

  const handleDelete = async (post: BlogPost) => {
    setDeletingId(post.id);
    setNotice(null);

    try {
      const res = await fetch(`/api/admin/blog/${post.id}`, { method: "DELETE" });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to delete post.");
      }

      setPosts((current) => current.filter((currentPost) => currentPost.id !== post.id));
      setNotice({
        tone: "success",
        message: `"${post.title}" was deleted.`,
      });
    } catch (error) {
      console.error(error);
      setNotice({
        tone: "error",
        message: error instanceof Error ? error.message : "Failed to delete the post.",
      });
    } finally {
      setDeletingId(null);
      setPendingDeletePost(null);
    }
  };

  const renderPostCard = (post: BlogPost) => {
    const isPublishing = savingId === post.id;
    const isDeleting = deletingId === post.id;

    return (
      <article
        key={post.id}
        className="bg-white rounded-2xl border border-border-light p-6 shadow-sm"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h2 className="text-lg font-semibold text-dark">{post.title}</h2>
              <span
                className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                  statusColors[post.status] || "bg-gray-50 text-gray-600"
                }`}
              >
                {post.status}
              </span>
            </div>

            <p className="text-text-muted text-sm mb-2">/blog/{post.slug}</p>
            <p className="text-sm text-text-muted leading-relaxed">
              {post.excerpt?.trim()
                ? post.excerpt
                : post.status === "draft"
                  ? "Draft post. Publish it when you want it to appear on the public blog."
                  : "Published post with no excerpt."}
            </p>
          </div>

          <div className="text-sm text-text-muted shrink-0 lg:text-right">
            <p>Created: {formatDate(post.created_at)}</p>
            <p>Live date: {formatDate(post.published_at)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-5">
          {post.status === "draft" ? (
            <button
              onClick={() => handleStatusChange(post, "published")}
              disabled={isPublishing || isDeleting}
              className="bg-gradient-to-r from-primary to-primary-light text-white font-semibold px-4 py-2 rounded-lg text-sm cursor-pointer border-none disabled:opacity-50"
            >
              {isPublishing ? "Publishing..." : "Publish"}
            </button>
          ) : (
            <>
              <a
                href={`/blog/${post.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-primary font-semibold px-4 py-2 rounded-lg border border-border-light no-underline text-sm hover:bg-primary/5 transition-all"
              >
                View Live
              </a>
              <button
                onClick={() => setPendingDraftPost(post)}
                disabled={isPublishing || isDeleting}
                className="bg-white text-primary font-semibold px-4 py-2 rounded-lg border border-border-light text-sm hover:bg-primary/5 transition-all cursor-pointer disabled:opacity-50"
              >
                {isPublishing ? "Saving..." : "Move to Draft"}
              </button>
            </>
          )}

          <Link
            href={`/admin/blog/${post.id}`}
            className="bg-white text-primary font-semibold px-4 py-2 rounded-lg border border-border-light no-underline text-sm hover:bg-primary/5 transition-all"
          >
            Edit Post
          </Link>

          <button
            onClick={() => setPendingDeletePost(post)}
            disabled={isPublishing || isDeleting}
            className="bg-white text-red-600 font-semibold px-4 py-2 rounded-lg border border-red-200 text-sm hover:bg-red-50 transition-all cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete Post"}
          </button>
        </div>
      </article>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark">Blog Posts</h1>
          <p className="text-text-muted mt-2 max-w-2xl">
            Publish and manage articles here. Published posts appear on your website. Drafts stay
            private until you publish them.
          </p>
        </div>

        <Link
          href="/admin/blog/new"
          className="bg-gradient-to-r from-primary to-primary-light text-white font-semibold px-5 py-2.5 rounded-lg no-underline text-sm hover:shadow-lg hover:shadow-primary/25 transition-all self-start"
        >
          New Blog Post
        </Link>
      </div>

      {notice && (
        <div>
          <AdminNotice
            tone={notice.tone}
            message={notice.message}
            onDismiss={() => setNotice(null)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-border-light p-5">
          <p className="text-text-muted text-xs font-semibold uppercase tracking-[0.18em] mb-2">
            Total Posts
          </p>
          <p className="text-3xl font-bold text-dark">{posts.length}</p>
        </div>

        <div className="bg-white rounded-2xl border border-border-light p-5">
          <p className="text-text-muted text-xs font-semibold uppercase tracking-[0.18em] mb-2">
            Published
          </p>
          <p className="text-3xl font-bold text-success">{totalPublished}</p>
          <p className="text-text-muted text-sm mt-2">These are currently live on the site.</p>
        </div>

        <div className="bg-white rounded-2xl border border-border-light p-5">
          <p className="text-text-muted text-xs font-semibold uppercase tracking-[0.18em] mb-2">
            Drafts
          </p>
          <p className="text-3xl font-bold text-yellow-700">{totalDrafts}</p>
          <p className="text-text-muted text-sm mt-2">These are hidden until you publish them.</p>
        </div>
      </div>

      {posts.length > 0 && (
        <div className="bg-white rounded-2xl border border-border-light p-5">
          <label className="block text-sm font-semibold text-dark mb-2">Search posts</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, slug, or excerpt"
            className="w-full px-4 py-3 rounded-xl border-2 border-border-light bg-white text-dark placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
          />
        </div>
      )}

      {posts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border-light p-12 text-center">
          <p className="text-text-muted mb-4">No blog posts yet.</p>
          <Link
            href="/admin/blog/new"
            className="text-primary font-semibold no-underline hover:underline text-sm"
          >
            Create your first blog post
          </Link>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border-light p-12 text-center">
          <p className="text-text-muted">No posts matched your search.</p>
        </div>
      ) : (
        <>
          <section className="space-y-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold text-dark">Needs Publishing</h2>
              <p className="text-sm text-text-muted">
                Draft posts do not show up on your website until you click publish.
              </p>
            </div>

            {draftPosts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-border-light p-8">
                <p className="text-text-muted">No drafts right now.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {draftPosts.map(renderPostCard)}
              </div>
            )}
          </section>

          <section className="space-y-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold text-dark">Live on Site</h2>
              <p className="text-sm text-text-muted">
                These posts are already visible on the public blog page.
              </p>
            </div>

            {publishedPosts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-border-light p-8">
                <p className="text-text-muted">No published posts yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {publishedPosts.map(renderPostCard)}
              </div>
            )}
          </section>
        </>
      )}
      <ConfirmDialog
        open={Boolean(pendingDraftPost)}
        title="Move this post to draft?"
        description={
          pendingDraftPost
            ? `"${pendingDraftPost.title}" will disappear from the public blog until you publish it again.`
            : ""
        }
        confirmLabel="Move to draft"
        loading={pendingDraftPost ? savingId === pendingDraftPost.id : false}
        onConfirm={() =>
          pendingDraftPost ? handleStatusChange(pendingDraftPost, "draft") : undefined
        }
        onCancel={() => setPendingDraftPost(null)}
      />
      <ConfirmDialog
        open={Boolean(pendingDeletePost)}
        title="Delete this post?"
        description={
          pendingDeletePost
            ? `"${pendingDeletePost.title}" will be permanently removed from the admin and public blog.`
            : ""
        }
        confirmLabel="Delete post"
        tone="danger"
        loading={pendingDeletePost ? deletingId === pendingDeletePost.id : false}
        onConfirm={() => (pendingDeletePost ? handleDelete(pendingDeletePost) : undefined)}
        onCancel={() => setPendingDeletePost(null)}
      />
    </div>
  );
}
