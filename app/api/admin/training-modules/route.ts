import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import {
  buildTrainingSeriesUpsertRow,
  validateTrainingSeriesForm,
  type TrainingSeriesFormData,
} from "@/lib/training-series";
import { isMissingRelationError } from "@/lib/supabase/errors";
import { getSupabase } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const { data, error } = await getSupabase()
      .from("training_module_groups")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      if (isMissingRelationError(error)) {
        return NextResponse.json({ items: [], schemaReady: false });
      }

      throw error;
    }

    return NextResponse.json({ items: data || [], schemaReady: true });
  } catch (error) {
    console.error("Training modules list error:", error);
    return NextResponse.json({ error: "Failed to fetch training modules." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = (await req.json()) as TrainingSeriesFormData;
    const validationError = validateTrainingSeriesForm(body);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const insertData = {
      ...buildTrainingSeriesUpsertRow(body),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await getSupabase()
      .from("training_module_groups")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      if (isMissingRelationError(error)) {
        return NextResponse.json(
          { error: "Training module schema is not set up yet. Run the SQL migration first." },
          { status: 400 }
        );
      }

      throw error;
    }

    return NextResponse.json({ item: data }, { status: 201 });
  } catch (error) {
    console.error("Training modules create error:", error);
    return NextResponse.json({ error: "Failed to create training group." }, { status: 500 });
  }
}
