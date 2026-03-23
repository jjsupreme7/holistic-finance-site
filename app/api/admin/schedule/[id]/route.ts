import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import {
  buildScheduleUpsertRow,
  validateScheduleForm,
  type ScheduleFormData,
} from "@/lib/schedule";
import { isMissingRelationError } from "@/lib/supabase/errors";
import { getSupabase } from "@/lib/supabase/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const { id } = await params;
    const { data, error } = await getSupabase()
      .from("schedule_items")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Schedule item not found." }, { status: 404 });
    }

    return NextResponse.json({ item: data });
  } catch (error) {
    console.error("Schedule get error:", error);
    return NextResponse.json({ error: "Failed to fetch schedule item." }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const { id } = await params;
    const body = (await req.json()) as ScheduleFormData;
    const validationError = validateScheduleForm(body);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const updateData = {
      ...buildScheduleUpsertRow(body),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await getSupabase()
      .from("schedule_items")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (isMissingRelationError(error)) {
        return NextResponse.json(
          { error: "Schedule schema is not set up yet. Run the SQL migration first." },
          { status: 400 }
        );
      }

      throw error;
    }

    return NextResponse.json({ item: data });
  } catch (error) {
    console.error("Schedule update error:", error);
    return NextResponse.json({ error: "Failed to update schedule item." }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const { id } = await params;
    const { error } = await getSupabase()
      .from("schedule_items")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Schedule delete error:", error);
    return NextResponse.json({ error: "Failed to delete schedule item." }, { status: 500 });
  }
}
