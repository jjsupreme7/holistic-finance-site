"use client";

import { useState } from "react";

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
  initialData,
}: BlogEditorProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
  const [status, setStatus] = useState(initialData?.status || defaultStatus);
  const [slugEdited, setSlugEdited] = useState(!!initialData?.slug);
  const isEditing = !!initialData;

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
      alert("Title and content are required.");
      return;
    }
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
    "w-full px-4 py-3 rounded-xl border-2 border-border-light bg-white text-dark placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-white rounded-xl border border-border-light p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-dark mb-1.5">
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
          <label className="block text-sm font-semibold text-dark mb-1.5">
            URL Slug
          </label>
          <div className="flex items-center gap-2">
            <span className="text-text-muted text-sm">/blog/</span>
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
          <label className="block text-sm font-semibold text-dark mb-1.5">
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
              <img
                src={coverImage}
                alt="Cover preview"
                className="w-full h-48 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-dark mb-1.5">
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
          <label className="block text-sm font-semibold text-dark mb-1.5">
            Content <span className="text-red-500">*</span>
          </label>
          <p className="text-text-muted text-xs mb-2">
            Write your article below. Use blank lines to separate paragraphs.
          </p>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your article..."
            rows={18}
            className={`${inputClass} resize-y leading-relaxed`}
            required
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border-light p-6">
        <div className="flex items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-4">
              <label className="block text-sm font-semibold text-dark">Status</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStatus("draft")}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize cursor-pointer border transition-all ${
                    status === "draft"
                      ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                      : "bg-white text-text-muted border-border-light hover:bg-yellow-50"
                  }`}
                >
                  Draft
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("published")}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize cursor-pointer border transition-all ${
                    status === "published"
                      ? "bg-success-bg text-success border-green-200"
                      : "bg-white text-text-muted border-border-light hover:bg-green-50"
                  }`}
                >
                  Published
                </button>
              </div>
            </div>
            <p className="text-text-muted text-xs mt-2">
              {status === "published"
                ? "This post will appear on the public /blog page after you save."
                : "Draft posts stay hidden from the public /blog page until you publish them."}
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
