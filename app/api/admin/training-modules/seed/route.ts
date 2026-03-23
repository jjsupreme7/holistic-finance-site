import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { buildDefaultTrainingSeriesRows } from "@/lib/training-series";
import { isMissingRelationError } from "@/lib/supabase/errors";
import { getSupabase } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const supabase = getSupabase();
    const { count, error: countError } = await supabase
      .from("training_module_groups")
      .select("id", { count: "exact", head: true });

    if (countError) {
      if (isMissingRelationError(countError)) {
        return NextResponse.json(
          { error: "Training module schema is not set up yet. Run the SQL migration first." },
          { status: 400 }
        );
      }

      throw countError;
    }

    if ((count || 0) > 0) {
      return NextResponse.json(
        { error: "Training groups already exist. Delete them first if you want to reseed." },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from("training_module_groups")
      .insert(buildDefaultTrainingSeriesRows())
      .select("*");

    if (error) throw error;

    return NextResponse.json({ items: data || [] }, { status: 201 });
  } catch (error) {
    console.error("Training modules seed error:", error);
    return NextResponse.json({ error: "Failed to seed training modules." }, { status: 500 });
  }
}
