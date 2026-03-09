"use client";

import { useEffect, useState } from "react";

interface Subscriber {
  id: string;
  email: string;
  first_name: string | null;
  subscribed_at: string;
  unsubscribed_at: string | null;
  status: string;
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "unsubscribed">("all");

  useEffect(() => {
    fetch("/api/admin/subscribers")
      .then((res) => res.json())
      .then((data) => setSubscribers(data.subscribers || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "all"
      ? subscribers
      : subscribers.filter((s) => s.status === filter);

  const [deleting, setDeleting] = useState<string | null>(null);

  const activeCount = subscribers.filter((s) => s.status === "active").length;

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to delete ${email}?`)) return;
    setDeleting(id);
    try {
      const res = await fetch("/api/admin/subscribers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setSubscribers((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(null);
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
      <div className="flex items-center justify-between mb-6">
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

      <div className="flex gap-2 mb-4">
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

      <div className="bg-white rounded-xl border border-border-light overflow-hidden">
        <table className="w-full text-sm">
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
                <tr key={s.id} className="border-b border-border-light last:border-0 hover:bg-[#f8faff] transition-colors">
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
                      onClick={() => handleDelete(s.id, s.email)}
                      disabled={deleting === s.id}
                      className="text-red-500 hover:text-red-700 text-xs font-semibold cursor-pointer border-none bg-transparent transition-colors disabled:opacity-50"
                    >
                      {deleting === s.id ? "Deleting…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
