"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AdminNotice from "@/components/admin/AdminNotice";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface TrainingSeriesListItem {
  id: string;
  status: "draft" | "published";
  eyebrow: string;
  title: string;
  description: string;
  accent: string | null;
  modules: Array<{ title?: string | null; description?: string | null; videoUrl?: string | null }> | null;
  sort_order: number;
}

interface Notice {
  tone: "success" | "error";
  message: string;
}

export default function AdminTrainingModulesPage() {
  const [items, setItems] = useState<TrainingSeriesListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [schemaReady, setSchemaReady] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [sortBy, setSortBy] = useState<"manual" | "title" | "modules">("manual");
  const [pendingDelete, setPendingDelete] = useState<TrainingSeriesListItem | null>(null);

  async function loadItems() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/training-modules");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load training groups.");
      }

      setItems(data.items || []);
      setSchemaReady(data.schemaReady !== false);
    } catch (error) {
      console.error(error);
      setNotice({ tone: "error", message: "Could not load training groups." });
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
      const res = await fetch("/api/admin/training-modules/seed", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        setNotice({ tone: "error", message: data.error || "Failed to import training modules." });
        return;
      }

      setItems(data.items || []);
      setNotice({ tone: "success", message: "Default training modules imported." });
    } catch {
      setNotice({ tone: "error", message: "Failed to import training modules." });
    } finally {
      setSeeding(false);
    }
  }

  async function handleStatusChange(
    item: TrainingSeriesListItem,
    nextStatus: "draft" | "published"
  ) {
    setSavingId(item.id);
    setNotice(null);

    try {
      const res = await fetch(`/api/admin/training-modules/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: nextStatus,
          eyebrow: item.eyebrow,
          title: item.title,
          description: item.description,
          accent: item.accent || "finance",
          sortOrder: item.sort_order,
          modules: (item.modules || []).map((module) => ({
            title: module.title || "",
            description: module.description || "",
            videoUrl: module.videoUrl || "",
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update training group.");
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
        message: error instanceof Error ? error.message : "Failed to update training group.",
      });
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(item: TrainingSeriesListItem) {
    setDeletingId(item.id);
    setNotice(null);

    try {
      const res = await fetch(`/api/admin/training-modules/${item.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Failed to delete training group.");
      }

      setItems((current) => current.filter((currentItem) => currentItem.id !== item.id));
      setNotice({ tone: "success", message: `"${item.title}" was deleted.` });
    } catch (error) {
      console.error(error);
      setNotice({
        tone: "error",
        message: error instanceof Error ? error.message : "Failed to delete training group.",
      });
    } finally {
      setDeletingId(null);
      setPendingDelete(null);
    }
  }

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    const visibleItems = items.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) {
        return false;
      }

      if (!query) {
        return true;
      }

      const moduleText = (item.modules || [])
        .map((module) => `${module.title || ""} ${module.description || ""}`)
        .join(" ")
        .toLowerCase();

      return (
        item.title.toLowerCase().includes(query) ||
        item.eyebrow.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        moduleText.includes(query)
      );
    });

    return [...visibleItems].sort((left, right) => {
      if (sortBy === "title") {
        return left.title.localeCompare(right.title);
      }

      if (sortBy === "modules") {
        return (right.modules || []).length - (left.modules || []).length;
      }

      return left.sort_order - right.sort_order;
    });
  }, [items, search, sortBy, statusFilter]);

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
          <h1 className="text-2xl font-bold text-admin-text">Curriculum</h1>
          <p className="text-admin-text-secondary text-sm mt-0.5">
            Manage evergreen training groups here. These are module collections that stay available
            outside the live class and event calendar.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSeed}
            disabled={seeding || !schemaReady}
            className="bg-admin-surface text-primary-light font-semibold px-5 py-2.5 rounded-lg border border-border-light text-sm hover:bg-primary/10 transition-all cursor-pointer disabled:opacity-50"
          >
            {seeding ? "Importing..." : "Import Defaults"}
          </button>
          <Link
            href="/admin/training-modules/new"
            className="bg-gradient-to-r from-primary to-primary-light text-white font-semibold px-5 py-2.5 rounded-lg no-underline text-sm hover:shadow-lg hover:shadow-primary/25 transition-all"
          >
            Add Curriculum Group
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
        <div className="bg-yellow-900/30 border border-yellow-800/50 rounded-xl p-5 mb-6">
          <p className="text-sm text-yellow-400">
            The `training_module_groups` table does not exist yet. Run the updated SQL in
            `supabase-schema.sql`, then reload this page.
          </p>
        </div>
      )}

      <div className="bg-admin-card rounded-2xl border border-border-light p-4 mb-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_180px_180px]">
          <div>
            <label className="block text-sm font-semibold text-admin-text mb-2">Search curriculum</label>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title, label, description, or module"
              className="w-full px-4 py-3 rounded-xl border-2 border-border-light bg-admin-surface text-admin-text placeholder:text-admin-text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-admin-text mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as "all" | "published" | "draft")
              }
              className="w-full px-4 py-3 rounded-xl border-2 border-border-light bg-admin-surface text-admin-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            >
              <option value="all">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-admin-text mb-2">Sort by</label>
            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value as "manual" | "title" | "modules")
              }
              className="w-full px-4 py-3 rounded-xl border-2 border-border-light bg-admin-surface text-admin-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            >
              <option value="manual">Manual order</option>
              <option value="title">Title A-Z</option>
              <option value="modules">Module count</option>
            </select>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-admin-card rounded-xl border border-border-light p-12 text-center">
          <p className="text-admin-text-secondary mb-4">No training groups yet.</p>
          <p className="text-admin-text-secondary text-sm mb-6">
            Use &ldquo;Import Defaults&rdquo; to pull in the current 26 training modules, then
            manage them from here going forward.
          </p>
          <button
            onClick={handleSeed}
            disabled={seeding || !schemaReady}
            className="bg-gradient-to-r from-primary to-primary-light text-white font-semibold px-6 py-2.5 rounded-lg text-sm hover:shadow-lg hover:shadow-primary/25 transition-all cursor-pointer border-none disabled:opacity-50"
          >
            {seeding ? "Importing..." : "Import Default Curriculum"}
          </button>
        </div>
      ) : (
        <div className="bg-admin-card rounded-xl border border-border-light overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-border-light bg-admin-surface">
                  <th className="text-left px-4 py-3 font-semibold text-admin-text-secondary text-xs uppercase tracking-wider">
                    Group
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-admin-text-secondary text-xs uppercase tracking-wider">
                    Modules
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-admin-text-secondary text-xs uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-admin-text-secondary text-xs uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-admin-text-secondary">
                      No curriculum groups match your current filters.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-border-light last:border-0 hover:bg-admin-hover transition-colors"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/training-modules/${item.id}`}
                          className="text-admin-text font-medium no-underline hover:text-primary-light transition-colors"
                        >
                          {item.title}
                        </Link>
                        <p className="text-admin-text-secondary text-xs mt-0.5">
                          {item.eyebrow} · sort #{item.sort_order}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-admin-text-secondary">
                        {(item.modules || []).length} modules
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                            item.status === "published"
                              ? "bg-green-900/30 text-green-400"
                              : "bg-yellow-900/30 text-yellow-400"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
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
                              className="bg-admin-surface text-primary-light font-semibold px-3 py-1.5 rounded-lg border border-border-light text-xs hover:bg-primary/10 transition-all cursor-pointer disabled:opacity-50"
                            >
                              {savingId === item.id ? "Saving..." : "Move to Draft"}
                            </button>
                          )}
                          <Link
                            href={`/admin/training-modules/${item.id}`}
                            className="bg-admin-surface text-primary-light font-semibold px-3 py-1.5 rounded-lg border border-border-light no-underline text-xs hover:bg-primary/10 transition-all"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => setPendingDelete(item)}
                            disabled={savingId === item.id || deletingId === item.id}
                            className="bg-red-900/20 text-red-400 font-semibold px-3 py-1.5 rounded-lg border border-red-800/50 text-xs hover:bg-red-900/30 transition-all cursor-pointer disabled:opacity-50"
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
        title="Delete this training group?"
        description={
          pendingDelete
            ? `This will remove "${pendingDelete.title}" from the curriculum.`
            : ""
        }
        confirmLabel="Delete group"
        tone="danger"
        loading={pendingDelete ? deletingId === pendingDelete.id : false}
        onConfirm={() => (pendingDelete ? handleDelete(pendingDelete) : undefined)}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
