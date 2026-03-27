"use client";

import { useEffect, useMemo, useState } from "react";
import AdminNotice from "@/components/admin/AdminNotice";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

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

interface Notice {
  tone: "success" | "error";
  message: string;
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "new" | "reviewed">("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [reviewing, setReviewing] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Submission | null>(null);

  useEffect(() => {
    fetch("/api/admin/submissions")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load submissions.");
        setSubmissions(data.submissions || []);
      })
      .catch((error) => {
        console.error(error);
        setNotice({ tone: "error", message: "Could not load submissions." });
      })
      .finally(() => setLoading(false));
  }, []);

  const newCount = submissions.filter((s) => s.status === "new").length;
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const matchesFilter =
      filter === "all"
        ? submissions
        : submissions.filter((submission) => submission.status === filter);

    const matchesQuery = query
      ? matchesFilter.filter((submission) => {
          const fullName = `${submission.first_name} ${submission.last_name}`.toLowerCase();
          return (
            fullName.includes(query) ||
            submission.email.toLowerCase().includes(query) ||
            (submission.phone || "").toLowerCase().includes(query) ||
            (submission.service || "").toLowerCase().includes(query) ||
            (submission.message || "").toLowerCase().includes(query)
          );
        })
      : matchesFilter;

    return [...matchesQuery].sort((left, right) => {
      if (sortBy === "name") {
        return `${left.first_name} ${left.last_name}`.localeCompare(
          `${right.first_name} ${right.last_name}`
        );
      }

      const leftTime = new Date(left.created_at).getTime();
      const rightTime = new Date(right.created_at).getTime();

      return sortBy === "oldest" ? leftTime - rightTime : rightTime - leftTime;
    });
  }, [filter, search, sortBy, submissions]);

  const markReviewed = async (id: string) => {
    setReviewing(id);
    setNotice(null);

    try {
      const res = await fetch("/api/admin/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "reviewed" }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Failed to update submission.");
      }

      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: "reviewed" } : s))
      );
      setNotice({ tone: "success", message: "Submission marked as reviewed." });
    } catch (error) {
      console.error(error);
      setNotice({
        tone: "error",
        message: error instanceof Error ? error.message : "Failed to update submission.",
      });
    } finally {
      setReviewing(null);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/submissions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Failed to delete submission.");
      }

      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      if (expanded === id) setExpanded(null);
      setNotice({ tone: "success", message: "Submission deleted." });
    } catch (err) {
      console.error("Delete failed:", err);
      setNotice({
        tone: "error",
        message: err instanceof Error ? err.message : "Failed to delete submission.",
      });
    } finally {
      setDeleting(null);
      setPendingDelete(null);
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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-admin-text">Contact Submissions</h1>
          <p className="text-admin-text-secondary text-sm mt-0.5">
            {newCount} new of {submissions.length} total
          </p>
        </div>
      </div>

      {notice && (
        <div className="mb-4">
          <AdminNotice
            tone={notice.tone}
            message={notice.message}
            onDismiss={() => setNotice(null)}
          />
        </div>
      )}

      <div className="bg-admin-card rounded-2xl border border-border-light p-4 mb-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-admin-text mb-2">Search submissions</label>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, email, phone, service, or message"
              className="w-full px-4 py-3 rounded-xl border-2 border-border-light bg-admin-surface text-admin-text placeholder:text-admin-text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />
          </div>

          <div className="w-full lg:w-52">
            <label className="block text-sm font-semibold text-admin-text mb-2">Sort by</label>
            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value as "newest" | "oldest" | "name")
              }
              className="w-full px-4 py-3 rounded-xl border-2 border-border-light bg-admin-surface text-admin-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {(["all", "new", "reviewed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize cursor-pointer border-none transition-colors ${
                filter === f
                  ? "bg-primary text-white"
                  : "bg-admin-surface text-text-light border border-border-light hover:bg-primary/10"
              }`}
            >
              {f}
              {f === "new" && newCount > 0 ? ` (${newCount})` : ""}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-admin-card rounded-xl border border-border-light overflow-hidden">
        {filtered.length === 0 ? (
          <p className="px-4 py-8 text-center text-admin-text-secondary">
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
                  className="flex items-center gap-4 px-4 py-3 hover:bg-admin-hover transition-colors cursor-pointer"
                  onClick={() => {
                    setExpanded(expanded === s.id ? null : s.id);
                  }}
                >
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      s.status === "new" ? "bg-primary" : "bg-border-light"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-admin-text font-medium truncate">
                      {s.first_name} {s.last_name}
                      {s.service && (
                        <span className="text-admin-text-secondary font-normal"> — {s.service}</span>
                      )}
                    </p>
                    <p className="text-xs text-admin-text-secondary truncate">{s.email}</p>
                  </div>
                  <span className="text-xs text-admin-text-secondary shrink-0">
                    {new Date(s.created_at).toLocaleDateString()}
                  </span>
                  <span className="text-admin-text-secondary text-sm">
                    {expanded === s.id ? "▲" : "▼"}
                  </span>
                </div>

                {/* Expanded detail */}
                {expanded === s.id && (
                  <div className="px-4 pb-4 pt-1 bg-admin-surface">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div>
                        <p className="text-xs text-admin-text-secondary font-semibold uppercase tracking-wider mb-0.5">
                          Name
                        </p>
                        <p className="text-sm text-admin-text">
                          {s.first_name} {s.last_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-admin-text-secondary font-semibold uppercase tracking-wider mb-0.5">
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
                          <p className="text-xs text-admin-text-secondary font-semibold uppercase tracking-wider mb-0.5">
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
                          <p className="text-xs text-admin-text-secondary font-semibold uppercase tracking-wider mb-0.5">
                            Service
                          </p>
                          <p className="text-sm text-admin-text">{s.service}</p>
                        </div>
                      )}
                    </div>
                    {s.message && (
                      <div className="mb-3">
                        <p className="text-xs text-admin-text-secondary font-semibold uppercase tracking-wider mb-0.5">
                          Message
                        </p>
                        <p className="text-sm text-admin-text whitespace-pre-wrap leading-relaxed">
                          {s.message}
                        </p>
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      {s.status === "new" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markReviewed(s.id);
                          }}
                          disabled={reviewing === s.id}
                          className="bg-admin-surface text-primary-light font-semibold px-4 py-1.5 rounded-lg border border-border-light text-xs hover:bg-primary/10 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {reviewing === s.id ? "Updating…" : "Mark Reviewed"}
                        </button>
                      )}
                      <a
                        href={`mailto:${s.email}?subject=Re: Your inquiry about ${s.service || "our services"}`}
                        className="bg-gradient-to-r from-primary to-primary-light text-white font-semibold px-4 py-1.5 rounded-lg no-underline text-xs hover:shadow-lg hover:shadow-primary/25 transition-all"
                      >
                        Reply
                      </a>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPendingDelete(s);
                        }}
                        disabled={deleting === s.id}
                        className="text-red-400 hover:text-red-300 text-xs font-semibold cursor-pointer border-none bg-transparent transition-colors disabled:opacity-50"
                      >
                        {deleting === s.id ? "Deleting…" : "Delete Submission"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this submission?"
        description={
          pendingDelete
            ? `This will permanently remove the submission from ${pendingDelete.first_name} ${pendingDelete.last_name}.`
            : ""
        }
        confirmLabel="Delete submission"
        tone="danger"
        loading={pendingDelete ? deleting === pendingDelete.id : false}
        onConfirm={() => (pendingDelete ? handleDelete(pendingDelete.id) : undefined)}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
