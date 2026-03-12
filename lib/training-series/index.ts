import { TRAINING_SERIES_GROUPS } from "@/lib/constants";
import { ICON_MAP, type IconName } from "@/lib/icons";

export type TrainingSeriesStatus = "draft" | "published";

export interface TrainingSeriesModule {
  number: number;
  title: string;
  description: string;
}

export interface TrainingSeriesGroup {
  id: string;
  status: TrainingSeriesStatus;
  eyebrow: string;
  title: string;
  description: string;
  accent: IconName;
  modules: TrainingSeriesModule[];
  sortOrder: number;
}

export interface TrainingSeriesGroupRow {
  id: string;
  status: TrainingSeriesStatus;
  eyebrow: string;
  title: string;
  description: string;
  accent: string | null;
  modules: Array<{
    number?: number | null;
    title?: string | null;
    description?: string | null;
  }> | null;
  sort_order: number;
  created_at?: string;
  updated_at?: string | null;
}

export interface TrainingSeriesFormData {
  status: TrainingSeriesStatus;
  eyebrow: string;
  title: string;
  description: string;
  accent?: string;
  sortOrder?: number;
  modules: Array<{
    title: string;
    description: string;
  }>;
}

function normalizeIconName(icon: string | null | undefined): IconName {
  if (!icon) return "finance";
  return icon in ICON_MAP ? (icon as IconName) : "finance";
}

export const TRAINING_GROUP_ICONS = (Object.keys(ICON_MAP) as IconName[]).sort((a, b) =>
  a.localeCompare(b)
);

export const DEFAULT_TRAINING_SERIES_GROUPS: TrainingSeriesGroup[] = TRAINING_SERIES_GROUPS.map(
  (group, index) => ({
    id: `default-training-group-${index + 1}`,
    status: "published",
    eyebrow: group.eyebrow,
    title: group.title,
    description: group.description,
    accent: normalizeIconName(group.accent),
    modules: group.modules.map((module, moduleIndex) => ({
      number: moduleIndex + 1,
      title: module.title,
      description: module.description,
    })),
    sortOrder: index,
  })
);

export function mapTrainingSeriesRowToGroup(row: TrainingSeriesGroupRow): TrainingSeriesGroup {
  const modules = (row.modules || [])
    .map((module, index) => ({
      number: Number.isFinite(module.number) ? Number(module.number) : index + 1,
      title: module.title?.trim() || "",
      description: module.description?.trim() || "",
    }))
    .filter((module) => module.title && module.description)
    .sort((a, b) => a.number - b.number);

  return {
    id: row.id,
    status: row.status,
    eyebrow: row.eyebrow,
    title: row.title,
    description: row.description,
    accent: normalizeIconName(row.accent),
    modules,
    sortOrder: row.sort_order,
  };
}

export function sortTrainingSeriesGroups(items: TrainingSeriesGroup[]) {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));
}

export function buildDefaultTrainingSeriesRows() {
  return DEFAULT_TRAINING_SERIES_GROUPS.map((group) => ({
    status: "published" as const,
    eyebrow: group.eyebrow,
    title: group.title,
    description: group.description,
    accent: group.accent,
    modules: group.modules.map((module, index) => ({
      number: index + 1,
      title: module.title,
      description: module.description,
    })),
    sort_order: group.sortOrder,
  }));
}

export function validateTrainingSeriesForm(data: TrainingSeriesFormData) {
  if (!data.eyebrow.trim()) {
    return "Section label is required.";
  }

  if (!data.title.trim()) {
    return "Group title is required.";
  }

  if (!data.description.trim()) {
    return "Group description is required.";
  }

  const modules = (data.modules || []).filter(
    (module) => module.title.trim() || module.description.trim()
  );

  if (modules.length === 0) {
    return "Add at least one module.";
  }

  const invalidModule = modules.find(
    (module) => !module.title.trim() || !module.description.trim()
  );

  if (invalidModule) {
    return "Each module needs both a title and description.";
  }

  return null;
}

export function buildTrainingSeriesUpsertRow(data: TrainingSeriesFormData) {
  const modules = (data.modules || [])
    .map((module) => ({
      title: module.title.trim(),
      description: module.description.trim(),
    }))
    .filter((module) => module.title && module.description)
    .map((module, index) => ({
      number: index + 1,
      title: module.title,
      description: module.description,
    }));

  return {
    status: data.status,
    eyebrow: data.eyebrow.trim(),
    title: data.title.trim(),
    description: data.description.trim(),
    accent: normalizeIconName(data.accent),
    modules,
    sort_order: Number.isFinite(data.sortOrder) ? Number(data.sortOrder) : 0,
  };
}
