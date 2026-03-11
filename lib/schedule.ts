import { CONTACT, COMMUNITY_EVENTS, COURSES } from "@/lib/constants";
import { ICON_MAP, type IconName } from "@/lib/icons";

export type ScheduleKind = "course" | "event";
export type ScheduleStatus = "draft" | "published";
export type CourseScheduleType = "free" | "paid";

export interface ScheduleItemRow {
  id: string;
  kind: ScheduleKind;
  status: ScheduleStatus;
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
  created_at?: string;
  updated_at?: string | null;
}

export interface CourseScheduleItem {
  id: string;
  title: string;
  icon: IconName;
  type: CourseScheduleType;
  price?: string;
  duration: string;
  format: string;
  date: string;
  description: string;
  sortOrder: number;
  status: ScheduleStatus;
}

export interface EventScheduleItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  summary: string;
  highlights: string[];
  sponsor: string;
  contactLabel: string;
  sortOrder: number;
  status: ScheduleStatus;
}

export const COURSE_ICONS: IconName[] = [
  "budgeting",
  "mortgage",
  "finance",
  "insurance",
  "family",
  "retirement",
  "education",
  "financial-services",
];

function normalizeIconName(icon: string | null | undefined): IconName {
  if (!icon) return "finance";
  return icon in ICON_MAP ? (icon as IconName) : "finance";
}

export const DEFAULT_COURSE_ITEMS: CourseScheduleItem[] = COURSES.map((course, index) => ({
  id: `default-course-${index + 1}`,
  title: course.title,
  icon: course.icon,
  type: course.type,
  price: course.type === "paid" ? course.price : undefined,
  duration: course.duration,
  format: course.format,
  date: course.date,
  description: course.description,
  sortOrder: index,
  status: "published",
}));

export const DEFAULT_EVENT_ITEMS: EventScheduleItem[] = COMMUNITY_EVENTS.map((event, index) => ({
  id: `default-event-${index + 1}`,
  title: event.title,
  date: event.date,
  time: event.time,
  location: event.location,
  summary: event.summary,
  highlights: event.highlights,
  sponsor: event.sponsor,
  contactLabel: event.contactLabel,
  sortOrder: index,
  status: "published",
}));

export function mapScheduleRowToCourse(row: ScheduleItemRow): CourseScheduleItem {
  return {
    id: row.id,
    title: row.title,
    icon: normalizeIconName(row.icon),
    type: row.schedule_type === "paid" ? "paid" : "free",
    price: row.price_label || undefined,
    duration: row.duration || "",
    format: row.format || "",
    date: row.date_label,
    description: row.description,
    sortOrder: row.sort_order,
    status: row.status,
  };
}

export function mapScheduleRowToEvent(row: ScheduleItemRow): EventScheduleItem {
  return {
    id: row.id,
    title: row.title,
    date: row.date_label,
    time: row.time_label || "",
    location: row.location || "",
    summary: row.description,
    highlights: row.highlights || [],
    sponsor: row.sponsor || "",
    contactLabel: row.contact_label || CONTACT.phone,
    sortOrder: row.sort_order,
    status: row.status,
  };
}

export function sortCourses(items: CourseScheduleItem[]) {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));
}

export function sortEvents(items: EventScheduleItem[]) {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));
}

export function buildDefaultScheduleRows() {
  const courseRows: Omit<ScheduleItemRow, "id">[] = DEFAULT_COURSE_ITEMS.map((course) => ({
    kind: "course",
    status: "published",
    title: course.title,
    icon: course.icon,
    schedule_type: course.type,
    price_label: course.price || null,
    duration: course.duration,
    format: course.format,
    date_label: course.date,
    time_label: null,
    description: course.description,
    location: null,
    highlights: null,
    sponsor: null,
    contact_label: null,
    sort_order: course.sortOrder,
  }));

  const eventRows: Omit<ScheduleItemRow, "id">[] = DEFAULT_EVENT_ITEMS.map((event) => ({
    kind: "event",
    status: "published",
    title: event.title,
    icon: null,
    schedule_type: null,
    price_label: null,
    duration: null,
    format: null,
    date_label: event.date,
    time_label: event.time,
    description: event.summary,
    location: event.location,
    highlights: event.highlights,
    sponsor: event.sponsor,
    contact_label: event.contactLabel,
    sort_order: event.sortOrder,
  }));

  return [...courseRows, ...eventRows];
}

export interface ScheduleFormData {
  kind: ScheduleKind;
  status: ScheduleStatus;
  title: string;
  icon?: string;
  scheduleType?: string;
  priceLabel?: string;
  duration?: string;
  format?: string;
  dateLabel: string;
  timeLabel?: string;
  description: string;
  location?: string;
  sponsor?: string;
  contactLabel?: string;
  highlightsText?: string;
  sortOrder?: number;
}

export function validateScheduleForm(data: ScheduleFormData) {
  if (!data.title.trim()) {
    return "Title is required.";
  }

  if (!data.dateLabel.trim()) {
    return "Date label is required.";
  }

  if (!data.description.trim()) {
    return "Description is required.";
  }

  if (data.kind === "course") {
    if (data.scheduleType !== "free" && data.scheduleType !== "paid") {
      return "Course type must be free or paid.";
    }

    if (!data.duration?.trim() || !data.format?.trim()) {
      return "Course duration and format are required.";
    }
  }

  if (data.kind === "event") {
    if (!data.timeLabel?.trim() || !data.location?.trim()) {
      return "Event time and location are required.";
    }
  }

  return null;
}

export function buildScheduleUpsertRow(data: ScheduleFormData) {
  const highlights = (data.highlightsText || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return {
    kind: data.kind,
    status: data.status,
    title: data.title.trim(),
    icon: data.kind === "course" ? (data.icon?.trim() || "finance") : null,
    schedule_type: data.kind === "course" ? data.scheduleType || "free" : null,
    price_label:
      data.kind === "course" && data.scheduleType === "paid" ? data.priceLabel?.trim() || null : null,
    duration: data.kind === "course" ? data.duration?.trim() || null : null,
    format: data.kind === "course" ? data.format?.trim() || null : null,
    date_label: data.dateLabel.trim(),
    time_label: data.kind === "event" ? data.timeLabel?.trim() || null : null,
    description: data.description.trim(),
    location: data.kind === "event" ? data.location?.trim() || null : null,
    highlights: data.kind === "event" ? highlights : null,
    sponsor: data.kind === "event" ? data.sponsor?.trim() || null : null,
    contact_label: data.kind === "event" ? data.contactLabel?.trim() || CONTACT.phone : null,
    sort_order: Number.isFinite(data.sortOrder) ? Number(data.sortOrder) : 0,
  };
}
