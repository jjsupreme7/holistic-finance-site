import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
  try {
    const { id } = await params;
    const body = await req.json();

    const updates: Record<string, unknown> = {};
    if (body.subject !== undefined) updates.subject = body.subject;
    if (body.bodyHtml !== undefined) updates.body_html = body.bodyHtml;
    if (body.previewText !== undefined) updates.preview_text = body.previewText;

    const { data, error } = await getSupabase()
      .from("campaigns")
      .update(updates)
      .eq("id", id)
      .eq("status", "draft")
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Campaign not found or already sent." },
        { status: 404 }
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
