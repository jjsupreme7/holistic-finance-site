import { unstable_noStore as noStore } from "next/cache";
import {
  DEFAULT_TRAINING_SERIES_GROUPS,
  mapTrainingSeriesRowToGroup,
  sortTrainingSeriesGroups,
  type TrainingSeriesGroupRow,
} from "@/lib/training-series";
import { isMissingRelationError } from "@/lib/supabase/errors";
import { getSupabase } from "@/lib/supabase/server";

export async function getPublishedTrainingSeriesGroups() {
  noStore();

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("training_module_groups")
      .select("*")
      .eq("status", "published")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      if (isMissingRelationError(error)) {
        return DEFAULT_TRAINING_SERIES_GROUPS;
      }

      throw error;
    }

    const rows = (data || []) as TrainingSeriesGroupRow[];
    if (rows.length === 0) {
      const { count, error: countError } = await supabase
        .from("training_module_groups")
        .select("id", { count: "exact", head: true });

      if (!countError && (count || 0) === 0) {
        return DEFAULT_TRAINING_SERIES_GROUPS;
      }

      return [];
    }

    return sortTrainingSeriesGroups(rows.map(mapTrainingSeriesRowToGroup));
  } catch (error) {
    console.error("Failed to load training series groups:", error);
    return DEFAULT_TRAINING_SERIES_GROUPS;
  }
}
