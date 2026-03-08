"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  status: string;
  published_at: string | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  draft: "bg-yellow-50 text-yellow-700",
  published: "bg-success-bg text-success",
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/blog")
      .then((res) => res.json())
      .then((data) => setPosts(data.posts || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark">Blog Posts</h1>
        <Link
          href="/admin/blog/new"
          className="bg-gradient-to-r from-primary to-primary-light text-white font-semibold px-5 py-2.5 rounded-lg no-underline text-sm hover:shadow-lg hover:shadow-primary/25 transition-all"
        >
          New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-xl border border-border-light p-12 text-center">
          <p className="text-text-muted mb-4">No blog posts yet.</p>
          <Link
            href="/admin/blog/new"
            className="text-primary font-semibold no-underline hover:underline text-sm"
          >
            Write your first article
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border-light overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-light bg-[#f8faff]">
                <th className="text-left px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider">
                  Title
                </th>
                <th className="text-left px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-border-light last:border-0 hover:bg-[#f8faff] transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="text-dark font-medium no-underline hover:text-primary transition-colors"
                    >
                      {post.title}
                    </Link>
                    <p className="text-text-muted text-xs mt-0.5">/blog/{post.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                        statusColors[post.status] || "bg-gray-50 text-gray-600"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-muted">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString()
                      : new Date(post.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
