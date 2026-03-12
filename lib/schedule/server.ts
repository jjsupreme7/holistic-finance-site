import { unstable_noStore as noStore } from "next/cache";
import {
  DEFAULT_COURSE_ITEMS,
  DEFAULT_EVENT_ITEMS,
  mapScheduleRowToCourse,
  mapScheduleRowToEvent,
  sortCourses,
  sortEvents,
  type ScheduleItemRow,
} from "@/lib/schedule";
import { isMissingRelationError } from "@/lib/supabase/errors";
import { getSupabase } from "@/lib/supabase/server";

async function fetchPublishedRows(kind: "course" | "event") {
  noStore();

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("schedule_items")
      .select("*")
      .eq("kind", kind)
      .eq("status", "published")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      if (isMissingRelationError(error)) {
        return [];
      }

      throw error;
    }

    const rows = (data || []) as ScheduleItemRow[];
    if (rows.length === 0) {
      const { count, error: countError } = await supabase
        .from("schedule_items")
        .select("id", { count: "exact", head: true })
        .eq("kind", kind);

      if (!countError && (count || 0) > 0) {
        return [];
      }
    }

    return rows;
  } catch (error) {
    console.error(`Failed to load ${kind} schedule items:`, error);
    return [];
  }
}

export async function getPublishedCourses() {
  const rows = await fetchPublishedRows("course");
  if (rows.length === 0) {
    return DEFAULT_COURSE_ITEMS;
  }

  return sortCourses(rows.map(mapScheduleRowToCourse));
}

export async function getPublishedEvents() {
  const rows = await fetchPublishedRows("event");
  if (rows.length === 0) {
    return DEFAULT_EVENT_ITEMS;
  }

  return sortEvents(rows.map(mapScheduleRowToEvent));
}
