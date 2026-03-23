import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import {
  buildScheduleUpsertRow,
  validateScheduleForm,
  type ScheduleFormData,
} from "@/lib/schedule";
import { isMissingRelationError } from "@/lib/supabase/errors";
import { getSupabase } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const { data, error } = await getSupabase()
      .from("schedule_items")
      .select("*")
      .order("kind", { ascending: true })
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
    console.error("Schedule list error:", error);
    return NextResponse.json({ error: "Failed to fetch schedule items." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = (await req.json()) as ScheduleFormData;
    const validationError = validateScheduleForm(body);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const insertData = {
      ...buildScheduleUpsertRow(body),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await getSupabase()
      .from("schedule_items")
      .insert(insertData)
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

    return NextResponse.json({ item: data }, { status: 201 });
  } catch (error) {
    console.error("Schedule create error:", error);
    return NextResponse.json({ error: "Failed to create schedule item." }, { status: 500 });
  }
}
