"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface TrainingSeriesListItem {
  id: string;
  status: "draft" | "published";
  eyebrow: string;
  title: string;
  modules: Array<{ title?: string | null; description?: string | null }> | null;
  sort_order: number;
}

export default function AdminTrainingModulesPage() {
  const [items, setItems] = useState<TrainingSeriesListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [schemaReady, setSchemaReady] = useState(true);
  const [seeding, setSeeding] = useState(false);

  async function loadItems() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/training-modules");
      const data = await res.json();
      setItems(data.items || []);
      setSchemaReady(data.schemaReady !== false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function handleSeed() {
    setSeeding(true);
    try {
      const res = await fetch("/api/admin/training-modules/seed", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to import training modules.");
        return;
      }

      setItems(data.items || []);
      alert("Default training modules imported.");
    } catch {
      alert("Failed to import training modules.");
    } finally {
      setSeeding(false);
    }
  }

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
          <h1 className="text-2xl font-bold text-dark">Training Modules</h1>
          <p className="text-text-muted text-sm mt-0.5">
            Manage the 26-module training curriculum separately from scheduled classes. Published
            groups appear on the website, while drafts stay hidden.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSeed}
            disabled={seeding || !schemaReady}
            className="bg-white text-primary font-semibold px-5 py-2.5 rounded-lg border border-border-light text-sm hover:bg-primary/5 transition-all cursor-pointer disabled:opacity-50"
          >
            {seeding ? "Importing..." : "Import Defaults"}
          </button>
          <Link
            href="/admin/training-modules/new"
            className="bg-gradient-to-r from-primary to-primary-light text-white font-semibold px-5 py-2.5 rounded-lg no-underline text-sm hover:shadow-lg hover:shadow-primary/25 transition-all"
          >
            Add Training Group
          </Link>
        </div>
      </div>

      {!schemaReady && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-6">
          <p className="text-sm text-yellow-800">
            The `training_module_groups` table does not exist yet. Run the updated SQL in
            `supabase-schema.sql`, then reload this page.
          </p>
        </div>
      )}

      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-border-light p-12 text-center">
          <p className="text-text-muted mb-4">No training groups yet.</p>
          <p className="text-text-muted text-sm mb-6">
            Use &ldquo;Import Defaults&rdquo; to pull in the current 26 training modules, then
            manage them from here going forward.
          </p>
          <button
            onClick={handleSeed}
            disabled={seeding || !schemaReady}
            className="bg-gradient-to-r from-primary to-primary-light text-white font-semibold px-6 py-2.5 rounded-lg text-sm hover:shadow-lg hover:shadow-primary/25 transition-all cursor-pointer border-none disabled:opacity-50"
          >
            {seeding ? "Importing..." : "Import Default Training Modules"}
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border-light overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-light bg-[#f8faff]">
                <th className="text-left px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider">
                  Group
                </th>
                <th className="text-left px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider">
                  Modules
                </th>
                <th className="text-left px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-border-light last:border-0 hover:bg-[#f8faff] transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/training-modules/${item.id}`}
                      className="text-dark font-medium no-underline hover:text-primary transition-colors"
                    >
                      {item.title}
                    </Link>
                    <p className="text-text-muted text-xs mt-0.5">
                      {item.eyebrow} · sort #{item.sort_order}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-text-muted">
                    {(item.modules || []).length} modules
                  </td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
