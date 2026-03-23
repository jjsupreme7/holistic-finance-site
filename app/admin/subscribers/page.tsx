"use client";

import { useEffect, useMemo, useState } from "react";
import AdminNotice from "@/components/admin/AdminNotice";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface Subscriber {
  id: string;
  email: string;
  first_name: string | null;
  subscribed_at: string;
  unsubscribed_at: string | null;
  status: string;
}

interface Notice {
  tone: "success" | "error";
  message: string;
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "unsubscribed">("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "email">("newest");
  const [notice, setNotice] = useState<Notice | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Subscriber | null>(null);

  useEffect(() => {
    fetch("/api/admin/subscribers")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load subscribers.");
        setSubscribers(data.subscribers || []);
      })
      .catch((error) => {
        console.error(error);
        setNotice({ tone: "error", message: "Could not load subscribers." });
      })
      .finally(() => setLoading(false));
  }, []);

  const [deleting, setDeleting] = useState<string | null>(null);

  const activeCount = subscribers.filter((s) => s.status === "active").length;
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const matchesFilter =
      filter === "all"
        ? subscribers
        : subscribers.filter((subscriber) => subscriber.status === filter);

    const matchesQuery = query
      ? matchesFilter.filter((subscriber) => {
          const name = subscriber.first_name?.toLowerCase() || "";
          return (
            subscriber.email.toLowerCase().includes(query) ||
            name.includes(query) ||
            subscriber.status.toLowerCase().includes(query)
          );
        })
      : matchesFilter;

    return [...matchesQuery].sort((left, right) => {
      if (sortBy === "email") {
        return left.email.localeCompare(right.email);
      }

      const leftTime = new Date(left.subscribed_at).getTime();
      const rightTime = new Date(right.subscribed_at).getTime();

      return sortBy === "oldest" ? leftTime - rightTime : rightTime - leftTime;
    });
  }, [filter, search, sortBy, subscribers]);

  const handleDelete = async (id: string, email: string) => {
    setDeleting(id);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/subscribers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Failed to delete subscriber.");
      }

      setSubscribers((prev) => prev.filter((s) => s.id !== id));
      setNotice({ tone: "success", message: `${email} was deleted.` });
    } catch (err) {
      console.error("Delete failed:", err);
      setNotice({
        tone: "error",
        message: err instanceof Error ? err.message : "Failed to delete subscriber.",
      });
    } finally {
      setDeleting(null);
      setPendingDelete(null);
    }
  };

  const exportCSV = () => {
    const rows = [
      ["Email", "First Name", "Status", "Subscribed At", "Unsubscribed At"],
      ...filtered.map((s) => [
        s.email,
        s.first_name || "",
        s.status,
        new Date(s.subscribed_at).toISOString(),
        s.unsubscribed_at ? new Date(s.unsubscribed_at).toISOString() : "",
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
          <h1 className="text-2xl font-bold text-dark">Subscribers</h1>
          <p className="text-text-muted text-sm mt-0.5">
            {activeCount} active of {subscribers.length} total
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="bg-white text-primary font-semibold px-4 py-2 rounded-lg text-sm border border-border-light hover:bg-primary/5 transition-all cursor-pointer"
        >
          Export CSV
        </button>
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

      <div className="bg-white rounded-2xl border border-border-light p-4 mb-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-dark mb-2">Search subscribers</label>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by email, name, or status"
              className="w-full px-4 py-3 rounded-xl border-2 border-border-light bg-white text-dark placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />
          </div>

          <div className="w-full lg:w-52">
            <label className="block text-sm font-semibold text-dark mb-2">Sort by</label>
            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value as "newest" | "oldest" | "email")
              }
              className="w-full px-4 py-3 rounded-xl border-2 border-border-light bg-white text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="email">Email A-Z</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {(["all", "active", "unsubscribed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize cursor-pointer border-none transition-colors ${
                filter === f
                  ? "bg-primary text-white"
                  : "bg-white text-text-light border border-border-light hover:bg-primary/5"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border-light overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border-light bg-[#f8faff]">
                <th className="text-left px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider">
                  Subscribed
                </th>
                <th className="text-right px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-text-muted">
                    No subscribers found.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-border-light last:border-0 hover:bg-[#f8faff] transition-colors"
                  >
                    <td className="px-4 py-3 text-dark">{s.email}</td>
                    <td className="px-4 py-3 text-text-light">{s.first_name || "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          s.status === "active"
                            ? "bg-success-bg text-success"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-muted">
                      {new Date(s.subscribed_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setPendingDelete(s)}
                        disabled={deleting === s.id}
                        className="text-red-500 hover:text-red-700 text-xs font-semibold cursor-pointer border-none bg-transparent transition-colors disabled:opacity-50"
                      >
                        {deleting === s.id ? "Deleting…" : "Delete Subscriber"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this subscriber?"
        description={
          pendingDelete
            ? `This will permanently remove ${pendingDelete.email} from the list.`
            : ""
        }
        confirmLabel="Delete subscriber"
        tone="danger"
        loading={pendingDelete ? deleting === pendingDelete.id : false}
        onConfirm={() =>
          pendingDelete ? handleDelete(pendingDelete.id, pendingDelete.email) : undefined
        }
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
