import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
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
      .from("campaigns")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Campaign not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ campaign: data });
  } catch (error) {
    console.error("Get campaign error:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaign." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const { id } = await params;
    const body = await req.json();

    const { data: existing, error: getError } = await getSupabase()
      .from("campaigns")
      .select("status, recipient_count")
      .eq("id", id)
      .single();

    if (getError || !existing) {
      return NextResponse.json(
        { error: "Campaign not found." },
        { status: 404 }
      );
    }

    const deliveredCount = Number(existing.recipient_count || 0);
    const canEdit =
      existing.status === "draft" || (existing.status === "failed" && deliveredCount === 0);

    if (!canEdit) {
      return NextResponse.json(
        { error: "This campaign can no longer be edited because delivery has already started." },
        { status: 409 }
      );
    }

    const updates: Record<string, unknown> = {};
    if (body.subject !== undefined) updates.subject = body.subject;
    if (body.bodyHtml !== undefined) updates.body_html = body.bodyHtml;
    if (body.previewText !== undefined) updates.preview_text = body.previewText;

    const { data, error } = await getSupabase()
      .from("campaigns")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Failed to update campaign." },
        { status: 500 }
      );
    }

    return NextResponse.json({ campaign: data });
  } catch (error) {
    console.error("Update campaign error:", error);
    return NextResponse.json(
      { error: "Failed to update campaign." },
      { status: 500 }
    );
  }
}
