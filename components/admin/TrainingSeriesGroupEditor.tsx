"use client";

import { useEffect, useMemo, useState } from "react";
import AdminNotice from "@/components/admin/AdminNotice";
import {
  TRAINING_GROUP_ICONS,
  type TrainingSeriesModule,
  type TrainingSeriesStatus,
} from "@/lib/training-series";

interface TrainingSeriesGroupEditorProps {
  onSave: (data: {
    status: TrainingSeriesStatus;
    eyebrow: string;
    title: string;
    description: string;
    accent: string;
    sortOrder: number;
    modules: Array<{
      title: string;
      description: string;
      videoUrl?: string;
    }>;
  }) => void;
  saving: boolean;
  onDirtyChange?: (dirty: boolean) => void;
  initialData?: {
    status: TrainingSeriesStatus;
    eyebrow: string;
    title: string;
    description: string;
    accent?: string | null;
    sortOrder: number;
    modules?: TrainingSeriesModule[] | null;
  };
}

function createEmptyModule() {
  return { title: "", description: "", videoUrl: "" };
}

export default function TrainingSeriesGroupEditor({
  onSave,
  saving,
  onDirtyChange,
  initialData,
}: TrainingSeriesGroupEditorProps) {
  const [status, setStatus] = useState<TrainingSeriesStatus>(initialData?.status || "published");
  const [eyebrow, setEyebrow] = useState(initialData?.eyebrow || "");
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [accent, setAccent] = useState(initialData?.accent || "finance");
  const [sortOrder, setSortOrder] = useState(initialData?.sortOrder || 0);
  const [modules, setModules] = useState(
    initialData?.modules?.map((module) => ({
      title: module.title,
      description: module.description,
      videoUrl: module.videoUrl || "",
    })) || [createEmptyModule()]
  );
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const isEditing = !!initialData;

  const initialSnapshot = useMemo(
    () =>
      JSON.stringify({
        status: initialData?.status || "published",
        eyebrow: initialData?.eyebrow || "",
        title: initialData?.title || "",
        description: initialData?.description || "",
        accent: initialData?.accent || "finance",
        sortOrder: initialData?.sortOrder || 0,
        modules:
          initialData?.modules?.map((module) => ({
            title: module.title,
            description: module.description,
            videoUrl: module.videoUrl || "",
          })) || [createEmptyModule()],
      }),
    [initialData]
  );
  const currentSnapshot = useMemo(
    () =>
      JSON.stringify({
        status,
        eyebrow,
        title,
        description,
        accent,
        sortOrder,
        modules,
      }),
    [accent, description, eyebrow, modules, sortOrder, status, title]
  );
  const isDirty = currentSnapshot !== initialSnapshot;

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const submitLabel = saving
    ? status === "published"
      ? "Publishing Curriculum Group..."
      : "Saving Draft..."
    : !isEditing
      ? status === "published"
        ? "Publish Curriculum Group"
        : "Save Curriculum Draft"
      : status === "published" && initialData?.status !== "published"
        ? "Publish Curriculum Group"
        : status === "draft"
          ? "Save Curriculum Draft"
          : "Update Curriculum Group";

  const inputClass =
    "w-full px-4 py-3 rounded-xl border-2 border-border-light bg-white text-dark placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm";

  function updateModule(
    index: number,
    field: "title" | "description" | "videoUrl",
    value: string
  ) {
    setModules((prev) =>
      prev.map((module, moduleIndex) =>
        moduleIndex === index ? { ...module, [field]: value } : module
      )
    );
  }

  function addModule() {
    setModules((prev) => [...prev, createEmptyModule()]);
  }

  function removeModule(index: number) {
    setModules((prev) => {
      if (prev.length === 1) {
        return [createEmptyModule()];
      }

      return prev.filter((_, moduleIndex) => moduleIndex !== index);
    });
  }

  function moveModule(index: number, direction: "up" | "down") {
    setModules((prev) => {
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) {
        return prev;
      }

      const next = [...prev];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!eyebrow.trim() || !title.trim() || !description.trim()) {
      setValidationMessage("Section label, group title, and description are required.");
      return;
    }

    const filledModules = modules.filter(
      (module) => module.title.trim() || module.description.trim()
    );

    if (filledModules.length === 0) {
      setValidationMessage("Add at least one module before saving this group.");
      return;
    }

    if (
      filledModules.some((module) => !module.title.trim() || !module.description.trim())
    ) {
      setValidationMessage("Each module needs both a title and description.");
      return;
    }

    setValidationMessage(null);
    onSave({
      status,
      eyebrow,
      title,
      description,
      accent,
      sortOrder,
      modules: filledModules,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {validationMessage && (
        <AdminNotice
          tone="error"
          message={validationMessage}
          onDismiss={() => setValidationMessage(null)}
        />
      )}

      <div className="bg-white rounded-xl border border-border-light p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-semibold text-dark mb-1.5">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TrainingSeriesStatus)}
              className={inputClass}
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <p className="text-text-muted text-xs mt-2">
              {status === "published"
                ? "Published curriculum groups appear on the public curriculum page."
                : "Draft curriculum groups stay hidden until you publish them."}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark mb-1.5">Accent Icon</label>
            <select
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
              className={inputClass}
            >
              {TRAINING_GROUP_ICONS.map((iconName) => (
                <option key={iconName} value={iconName}>
                  {iconName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark mb-1.5">Sort Order</label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-dark mb-1.5">
              Section Label <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={eyebrow}
              onChange={(e) => setEyebrow(e.target.value)}
              placeholder="Foundations"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark mb-1.5">
              Group Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Personal Finance Foundations"
              className={inputClass}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-dark mb-1.5">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Short summary for this module group."
            className={inputClass}
            required
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border-light p-6">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-lg font-semibold text-dark">Modules</h2>
            <p className="text-text-muted text-sm mt-1">
              Add, remove, and reorder the module cards that appear inside this group.
            </p>
          </div>
          <button
            type="button"
            onClick={addModule}
            className="bg-white text-primary font-semibold px-4 py-2 rounded-lg border border-border-light text-sm hover:bg-primary/5 transition-all cursor-pointer"
          >
            Add Module
          </button>
        </div>

        <div className="space-y-4">
          {modules.map((module, index) => (
            <div key={index} className="rounded-xl border border-border-light p-5 bg-[#fbfcfe]">
              <div className="flex items-center justify-between gap-3 mb-4">
                <p className="text-sm font-semibold text-dark">Module {index + 1}</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => moveModule(index, "up")}
                    disabled={index === 0}
                    className="bg-white text-primary font-semibold px-3 py-1.5 rounded-lg border border-border-light text-xs hover:bg-primary/5 transition-all cursor-pointer disabled:opacity-40"
                  >
                    Move Up
                  </button>
                  <button
                    type="button"
                    onClick={() => moveModule(index, "down")}
                    disabled={index === modules.length - 1}
                    className="bg-white text-primary font-semibold px-3 py-1.5 rounded-lg border border-border-light text-xs hover:bg-primary/5 transition-all cursor-pointer disabled:opacity-40"
                  >
                    Move Down
                  </button>
                  <button
                    type="button"
                    onClick={() => removeModule(index)}
                    className="bg-white text-red-600 font-semibold px-3 py-1.5 rounded-lg border border-red-200 text-xs hover:bg-red-50 transition-all cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-1.5">
                    Module Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={module.title}
                    onChange={(e) => updateModule(index, "title", e.target.value)}
                    placeholder="Investment Basics"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-1.5">
                    Module Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={module.description}
                    onChange={(e) => updateModule(index, "description", e.target.value)}
                    rows={3}
                    placeholder="What this module teaches."
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-1.5">
                    Video URL <span className="text-text-muted font-normal">(optional)</span>
                  </label>
                  <input
                    type="url"
                    value={module.videoUrl}
                    onChange={(e) => updateModule(index, "videoUrl", e.target.value)}
                    placeholder="https://vimeo.com/... or https://youtube.com/..."
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border-light p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm text-text-muted">
            {isDirty
              ? "You have unsaved changes in this curriculum group."
              : "All changes are saved."}
          </p>
          <button
            type="submit"
            disabled={saving}
            className="bg-gradient-to-r from-primary to-primary-light text-white font-semibold px-6 py-3 rounded-lg text-sm hover:shadow-lg hover:shadow-primary/25 transition-all cursor-pointer disabled:opacity-50 border-none"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
