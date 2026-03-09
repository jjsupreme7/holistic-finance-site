"use client";

import { useEffect, useState } from "react";

interface Submission {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  service: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "new" | "reviewed">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/submissions")
      .then((res) => res.json())
      .then((data) => setSubmissions(data.submissions || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "all"
      ? submissions
      : submissions.filter((s) => s.status === filter);

  const newCount = submissions.filter((s) => s.status === "new").length;

  const markReviewed = async (id: string) => {
    const res = await fetch("/api/admin/submissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "reviewed" }),
    });
    if (res.ok) {
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: "reviewed" } : s))
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this submission?")) return;
    setDeleting(id);
    try {
      const res = await fetch("/api/admin/submissions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setSubmissions((prev) => prev.filter((s) => s.id !== id));
        if (expanded === id) setExpanded(null);
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(null);
    }
  };

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
        <div>
          <h1 className="text-2xl font-bold text-dark">Contact Submissions</h1>
          <p className="text-text-muted text-sm mt-0.5">
            {newCount} new of {submissions.length} total
          </p>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {(["all", "new", "reviewed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize cursor-pointer border-none transition-colors ${
              filter === f
                ? "bg-primary text-white"
                : "bg-white text-text-light border border-border-light hover:bg-primary/5"
            }`}
          >
            {f}{f === "new" && newCount > 0 ? ` (${newCount})` : ""}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-border-light overflow-hidden">
        {filtered.length === 0 ? (
          <p className="px-4 py-8 text-center text-text-muted">
            No submissions found.
          </p>
        ) : (
          <div>
            {filtered.map((s) => (
              <div
                key={s.id}
                className="border-b border-border-light last:border-0"
              >
                {/* Row */}
                <div
                  className="flex items-center gap-4 px-4 py-3 hover:bg-[#f8faff] transition-colors cursor-pointer"
                  onClick={() => {
                    setExpanded(expanded === s.id ? null : s.id);
                    if (s.status === "new") markReviewed(s.id);
                  }}
                >
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      s.status === "new" ? "bg-primary" : "bg-border-light"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-dark font-medium truncate">
                      {s.first_name} {s.last_name}
                      {s.service && (
                        <span className="text-text-muted font-normal"> — {s.service}</span>
                      )}
                    </p>
                    <p className="text-xs text-text-muted truncate">{s.email}</p>
                  </div>
                  <span className="text-xs text-text-muted shrink-0">
                    {new Date(s.created_at).toLocaleDateString()}
                  </span>
                  <span className="text-text-muted text-sm">
                    {expanded === s.id ? "▲" : "▼"}
                  </span>
                </div>

                {/* Expanded detail */}
                {expanded === s.id && (
                  <div className="px-4 pb-4 pt-1 bg-[#f8faff]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div>
                        <p className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-0.5">
                          Name
                        </p>
                        <p className="text-sm text-dark">
                          {s.first_name} {s.last_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-0.5">
                          Email
                        </p>
                        <a
                          href={`mailto:${s.email}`}
                          className="text-sm text-primary no-underline hover:underline"
                        >
                          {s.email}
                        </a>
                      </div>
                      {s.phone && (
                        <div>
                          <p className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-0.5">
                            Phone
                          </p>
                          <a
                            href={`tel:${s.phone}`}
                            className="text-sm text-primary no-underline hover:underline"
                          >
                            {s.phone}
                          </a>
                        </div>
                      )}
                      {s.service && (
                        <div>
                          <p className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-0.5">
                            Service
                          </p>
                          <p className="text-sm text-dark">{s.service}</p>
                        </div>
                      )}
                    </div>
                    {s.message && (
                      <div className="mb-3">
                        <p className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-0.5">
                          Message
                        </p>
                        <p className="text-sm text-dark whitespace-pre-wrap leading-relaxed">
                          {s.message}
                        </p>
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      <a
                        href={`mailto:${s.email}?subject=Re: Your inquiry about ${s.service || "our services"}`}
                        className="bg-gradient-to-r from-primary to-primary-light text-white font-semibold px-4 py-1.5 rounded-lg no-underline text-xs hover:shadow-lg hover:shadow-primary/25 transition-all"
                      >
                        Reply
                      </a>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(s.id);
                        }}
                        disabled={deleting === s.id}
                        className="text-red-500 hover:text-red-700 text-xs font-semibold cursor-pointer border-none bg-transparent transition-colors disabled:opacity-50"
                      >
                        {deleting === s.id ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
