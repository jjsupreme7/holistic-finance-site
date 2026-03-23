"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AdminNotice from "@/components/admin/AdminNotice";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface ScheduleItem {
  id: string;
  kind: "course" | "event";
  status: "draft" | "published";
  title: string;
  icon: string | null;
  schedule_type: string | null;
  price_label: string | null;
  duration: string | null;
  format: string | null;
  date_label: string;
  time_label: string | null;
  description: string;
  location: string | null;
  highlights: string[] | null;
  sponsor: string | null;
  contact_label: string | null;
  sort_order: number;
}

interface Notice {
  tone: "success" | "error";
  message: string;
}

export default function AdminSchedulePage() {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [schemaReady, setSchemaReady] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [search, setSearch] = useState("");
  const [kindFilter, setKindFilter] = useState<"all" | "course" | "event">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [sortBy, setSortBy] = useState<"manual" | "title" | "status">("manual");
  const [pendingDelete, setPendingDelete] = useState<ScheduleItem | null>(null);

  async function loadItems() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/schedule");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load schedule items.");
      }

      setItems(data.items || []);
      setSchemaReady(data.schemaReady !== false);
    } catch (error) {
      console.error(error);
      setNotice({ tone: "error", message: "Could not load schedule items." });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function handleSeed() {
    setSeeding(true);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/schedule/seed", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        setNotice({ tone: "error", message: data.error || "Failed to import schedule items." });
        return;
      }

      setItems(data.items || []);
      setNotice({ tone: "success", message: "Default courses and events imported." });
    } catch {
      setNotice({ tone: "error", message: "Failed to import default schedule items." });
    } finally {
      setSeeding(false);
    }
  }

  async function handleStatusChange(item: ScheduleItem, nextStatus: "draft" | "published") {
    setSavingId(item.id);
    setNotice(null);

    try {
      const res = await fetch(`/api/admin/schedule/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: item.kind,
          status: nextStatus,
          title: item.title,
          icon: item.icon || "finance",
          scheduleType: item.schedule_type || "free",
          priceLabel: item.price_label || "",
          duration: item.duration || "",
          format: item.format || "",
          dateLabel: item.date_label,
          timeLabel: item.time_label || "",
          description: item.description,
          location: item.location || "",
          sponsor: item.sponsor || "",
          contactLabel: item.contact_label || "",
          highlightsText: (item.highlights || []).join("\n"),
          sortOrder: item.sort_order,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update item.");
      }

      setItems((current) =>
        current.map((currentItem) => (currentItem.id === item.id ? data.item : currentItem))
      );
      setNotice({
        tone: "success",
        message:
          nextStatus === "published"
            ? `"${item.title}" is now live on the website.`
            : `"${item.title}" was moved to draft.`,
      });
    } catch (error) {
      console.error(error);
      setNotice({
        tone: "error",
        message: error instanceof Error ? error.message : "Failed to update item.",
      });
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(item: ScheduleItem) {
    setDeletingId(item.id);
    setNotice(null);

    try {
      const res = await fetch(`/api/admin/schedule/${item.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Failed to delete item.");
      }

      setItems((current) => current.filter((currentItem) => currentItem.id !== item.id));
      setNotice({ tone: "success", message: `"${item.title}" was deleted.` });
    } catch (error) {
      console.error(error);
      setNotice({
        tone: "error",
        message: error instanceof Error ? error.message : "Failed to delete item.",
      });
    } finally {
      setDeletingId(null);
      setPendingDelete(null);
    }
  }

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    const visibleItems = items.filter((item) => {
      if (kindFilter !== "all" && item.kind !== kindFilter) {
        return false;
      }

      if (statusFilter !== "all" && item.status !== statusFilter) {
        return false;
      }

      if (!query) {
        return true;
      }

      return (
        item.title.toLowerCase().includes(query) ||
        item.kind.toLowerCase().includes(query) ||
        item.status.toLowerCase().includes(query) ||
        item.date_label.toLowerCase().includes(query) ||
        (item.location || "").toLowerCase().includes(query)
      );
    });

    return [...visibleItems].sort((left, right) => {
      if (sortBy === "title") {
        return left.title.localeCompare(right.title);
      }

      if (sortBy === "status") {
        return left.status.localeCompare(right.status) || left.sort_order - right.sort_order;
      }

      return left.sort_order - right.sort_order;
    });
  }, [items, kindFilter, search, sortBy, statusFilter]);

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
          <h1 className="text-2xl font-bold text-dark">Courses &amp; Events</h1>
          <p className="text-text-muted text-sm mt-0.5">
            Manage anything tied to a calendar date here. Use this area for classes, workshops,
            and public events. Evergreen training content belongs in Curriculum.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSeed}
            disabled={seeding || !schemaReady}
            className="bg-white text-primary font-semibold px-5 py-2.5 rounded-lg border border-border-light text-sm hover:bg-primary/5 transition-all cursor-pointer disabled:opacity-50"
          >
            {seeding ? "Importing..." : "Import Defaults"}
          </button>
          <Link
            href="/admin/schedule/new"
            className="bg-gradient-to-r from-primary to-primary-light text-white font-semibold px-5 py-2.5 rounded-lg no-underline text-sm hover:shadow-lg hover:shadow-primary/25 transition-all"
          >
            Add Course or Event
          </Link>
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

      {!schemaReady && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-6">
          <p className="text-sm text-yellow-800">
            The `schedule_items` table does not exist yet. Run the updated SQL in
            `supabase-schema.sql`, then reload this page.
          </p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-border-light p-4 mb-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_180px_180px_180px]">
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Search schedule</label>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title, date, location, or type"
              className="w-full px-4 py-3 rounded-xl border-2 border-border-light bg-white text-dark placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Type</label>
            <select
              value={kindFilter}
              onChange={(event) =>
                setKindFilter(event.target.value as "all" | "course" | "event")
              }
              className="w-full px-4 py-3 rounded-xl border-2 border-border-light bg-white text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            >
              <option value="all">All types</option>
              <option value="course">Courses</option>
              <option value="event">Events</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as "all" | "published" | "draft")
              }
              className="w-full px-4 py-3 rounded-xl border-2 border-border-light bg-white text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            >
              <option value="all">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Sort by</label>
            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value as "manual" | "title" | "status")
              }
              className="w-full px-4 py-3 rounded-xl border-2 border-border-light bg-white text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            >
              <option value="manual">Manual order</option>
              <option value="title">Title A-Z</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-border-light p-12 text-center">
          <p className="text-text-muted mb-4">No schedule items yet.</p>
          <p className="text-text-muted text-sm mb-6">
            Use &ldquo;Import Defaults&rdquo; to pull in the current course and event data, then edit
            from here going forward.
          </p>
          <button
            onClick={handleSeed}
            disabled={seeding || !schemaReady}
            className="bg-gradient-to-r from-primary to-primary-light text-white font-semibold px-6 py-2.5 rounded-lg text-sm hover:shadow-lg hover:shadow-primary/25 transition-all cursor-pointer border-none disabled:opacity-50"
          >
            {seeding ? "Importing..." : "Import Default Schedule"}
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border-light overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-border-light bg-[#f8faff]">
                  <th className="text-left px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider">
                    Title
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider">
                    Kind
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-text-muted">
                      No courses or events match your current filters.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-border-light last:border-0 hover:bg-[#f8faff] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/schedule/${item.id}`}
                          className="text-dark font-medium no-underline hover:text-primary transition-colors"
                        >
                          {item.title}
                        </Link>
                        <p className="text-text-muted text-xs mt-0.5">sort #{item.sort_order}</p>
                      </td>
                      <td className="px-4 py-3 text-text-muted capitalize">{item.kind}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                            item.status === "published"
                              ? "bg-success-bg text-success"
                              : "bg-yellow-50 text-yellow-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text-muted">{item.date_label}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          {item.status === "draft" ? (
                            <button
                              onClick={() => handleStatusChange(item, "published")}
                              disabled={savingId === item.id || deletingId === item.id}
                              className="bg-gradient-to-r from-primary to-primary-light text-white font-semibold px-3 py-1.5 rounded-lg text-xs cursor-pointer border-none disabled:opacity-50"
                            >
                              {savingId === item.id ? "Publishing..." : "Publish"}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(item, "draft")}
                              disabled={savingId === item.id || deletingId === item.id}
                              className="bg-white text-primary font-semibold px-3 py-1.5 rounded-lg border border-border-light text-xs hover:bg-primary/5 transition-all cursor-pointer disabled:opacity-50"
                            >
                              {savingId === item.id ? "Saving..." : "Move to Draft"}
                            </button>
                          )}
                          <Link
                            href={`/admin/schedule/${item.id}`}
                            className="bg-white text-primary font-semibold px-3 py-1.5 rounded-lg border border-border-light no-underline text-xs hover:bg-primary/5 transition-all"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => setPendingDelete(item)}
                            disabled={savingId === item.id || deletingId === item.id}
                            className="bg-white text-red-600 font-semibold px-3 py-1.5 rounded-lg border border-red-200 text-xs hover:bg-red-50 transition-all cursor-pointer disabled:opacity-50"
                          >
                            {deletingId === item.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this item?"
        description={
          pendingDelete
            ? `This will remove "${pendingDelete.title}" from your courses and events list.`
            : ""
        }
        confirmLabel="Delete item"
        tone="danger"
        loading={pendingDelete ? deletingId === pendingDelete.id : false}
        onConfirm={() => (pendingDelete ? handleDelete(pendingDelete) : undefined)}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
