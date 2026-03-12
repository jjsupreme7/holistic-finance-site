import { NextResponse } from "next/server";
import {
  buildTrainingSeriesUpsertRow,
  validateTrainingSeriesForm,
  type TrainingSeriesFormData,
} from "@/lib/training-series";
import { isMissingRelationError } from "@/lib/supabase/errors";
import { getSupabase } from "@/lib/supabase/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data, error } = await getSupabase()
      .from("training_module_groups")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Training group not found." }, { status: 404 });
    }

    return NextResponse.json({ item: data });
  } catch (error) {
    console.error("Training modules get error:", error);
    return NextResponse.json({ error: "Failed to fetch training group." }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = (await req.json()) as TrainingSeriesFormData;
    const validationError = validateTrainingSeriesForm(body);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const updateData = {
      ...buildTrainingSeriesUpsertRow(body),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await getSupabase()
      .from("training_module_groups")
      .update(updateData)
      .eq("id", id)
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

    return NextResponse.json({ item: data });
  } catch (error) {
    console.error("Training modules update error:", error);
    return NextResponse.json({ error: "Failed to update training group." }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await getSupabase()
      .from("training_module_groups")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Training modules delete error:", error);
    return NextResponse.json({ error: "Failed to delete training group." }, { status: 500 });
  }
}
