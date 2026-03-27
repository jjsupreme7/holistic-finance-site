"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import AdminNotice from "@/components/admin/AdminNotice";
import RichTextEditor from "@/components/admin/RichTextEditor";

interface BlogEditorProps {
  onSave: (data: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    status: string;
  }) => void;
  saving: boolean;
  defaultStatus?: "draft" | "published";
  onDirtyChange?: (dirty: boolean) => void;
  initialData?: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    status: string;
  };
}

function toSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function BlogEditor({
  onSave,
  saving,
  defaultStatus = "draft",
  onDirtyChange,
  initialData,
}: BlogEditorProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
  const [status, setStatus] = useState(initialData?.status || defaultStatus);
  const [slugEdited, setSlugEdited] = useState(!!initialData?.slug);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const isEditing = !!initialData;

  const initialSnapshot = useMemo(
    () =>
      JSON.stringify({
        title: initialData?.title || "",
        slug: initialData?.slug || "",
        excerpt: initialData?.excerpt || "",
        content: initialData?.content || "",
        coverImage: initialData?.coverImage || "",
        status: initialData?.status || defaultStatus,
      }),
    [defaultStatus, initialData]
  );
  const currentSnapshot = useMemo(
    () =>
      JSON.stringify({
        title,
        slug,
        excerpt,
        content,
        coverImage,
        status,
      }),
    [content, coverImage, excerpt, slug, status, title]
  );
  const isDirty = currentSnapshot !== initialSnapshot;

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const submitLabel = saving
    ? status === "published"
      ? "Publishing..."
      : "Saving..."
    : !isEditing
      ? status === "published"
        ? "Publish Post"
        : "Save Draft"
      : status === "published" && initialData?.status !== "published"
        ? "Publish Post"
        : status === "draft"
          ? "Save Draft"
          : "Update Post";

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugEdited) {
      setSlug(toSlug(value));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setValidationMessage("Title and content are required before you save.");
      return;
    }
    setValidationMessage(null);
    onSave({
      title,
      slug: slug || toSlug(title),
      excerpt,
      content,
      coverImage,
      status,
    });
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border-2 border-border-light bg-admin-surface text-admin-text placeholder:text-admin-text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {validationMessage && (
        <AdminNotice
          tone="error"
          message={validationMessage}
          onDismiss={() => setValidationMessage(null)}
        />
      )}

      <div className="bg-admin-card rounded-xl border border-border-light p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-admin-text mb-1.5">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Your article title"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-admin-text mb-1.5">
            URL Slug
          </label>
          <div className="flex items-center gap-2">
            <span className="text-admin-text-secondary text-sm">/blog/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(toSlug(e.target.value));
                setSlugEdited(true);
              }}
              placeholder="your-article-title"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-admin-text mb-1.5">
            Cover Image URL
          </label>
          <input
            type="url"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className={inputClass}
          />
          {coverImage && (
            <div className="mt-2 border border-border-light rounded-lg overflow-hidden">
              <Image
                src={coverImage}
                alt="Cover preview"
                width={1200}
                height={384}
                unoptimized
                className="w-full h-48 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-admin-text mb-1.5">
            Excerpt
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="A brief summary that appears on the blog listing page..."
            rows={2}
            className={`${inputClass} resize-y`}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-admin-text mb-1.5">
            Content <span className="text-red-500">*</span>
          </label>
          <p className="text-admin-text-secondary text-xs mb-2">
            Use the toolbar to format your article with headings, bold, lists, links, and more.
          </p>
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="Start writing your article..."
          />
        </div>
      </div>

      <div className="bg-admin-card rounded-xl border border-border-light p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-4">
              <label className="block text-sm font-semibold text-admin-text">Status</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStatus("draft")}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize cursor-pointer border transition-all ${
                    status === "draft"
                      ? "bg-yellow-900/30 text-yellow-400 border-yellow-800"
                      : "bg-admin-surface text-admin-text-secondary border-border-light hover:bg-yellow-900/20"
                  }`}
                >
                  Draft
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("published")}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize cursor-pointer border transition-all ${
                    status === "published"
                      ? "bg-green-900/30 text-green-400 border-green-800"
                      : "bg-admin-surface text-admin-text-secondary border-border-light hover:bg-green-900/20"
                  }`}
                >
                  Published
                </button>
              </div>
            </div>
            <p className="text-admin-text-secondary text-xs mt-2">
              {status === "published"
                ? "This post will appear on the public /blog page after you save."
                : "Draft posts stay hidden from the public /blog page until you publish them."}
            </p>
            <p className="text-admin-text-secondary text-xs mt-2">
              {isDirty ? "You have unsaved changes on this post." : "All changes are saved."}
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-gradient-to-r from-primary to-primary-light text-white font-semibold px-8 py-2.5 rounded-lg text-sm hover:shadow-lg hover:shadow-primary/25 transition-all cursor-pointer border-none disabled:opacity-50"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
