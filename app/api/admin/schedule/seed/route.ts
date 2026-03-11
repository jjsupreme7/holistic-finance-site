import { NextResponse } from "next/server";
import { buildDefaultScheduleRows } from "@/lib/schedule";
import { isMissingRelationError } from "@/lib/supabase/errors";
import { getSupabase } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = getSupabase();
    const { count, error: countError } = await supabase
      .from("schedule_items")
      .select("id", { count: "exact", head: true });

    if (countError) {
      if (isMissingRelationError(countError)) {
        return NextResponse.json(
          { error: "Schedule schema is not set up yet. Run the SQL migration first." },
          { status: 400 }
        );
      }

      throw countError;
    }

    if ((count || 0) > 0) {
      return NextResponse.json(
        { error: "Schedule items already exist. Delete them first if you want to reseed." },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from("schedule_items")
      .insert(buildDefaultScheduleRows())
      .select("*");

    if (error) throw error;

    return NextResponse.json({ items: data || [] }, { status: 201 });
  } catch (error) {
    console.error("Schedule seed error:", error);
    return NextResponse.json({ error: "Failed to seed schedule items." }, { status: 500 });
  }
}
