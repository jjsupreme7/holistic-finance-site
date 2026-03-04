import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";

export async function GET() {
  try {
    const { data, error } = await getSupabase()
      .from("campaigns")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ campaigns: data });
  } catch (error) {
    console.error("Fetch campaigns error:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaigns." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { subject, bodyHtml, previewText } = await req.json();

    if (!subject || !bodyHtml) {
      return NextResponse.json(
        { error: "Subject and body are required." },
        { status: 400 }
      );
    }

    const { data, error } = await getSupabase()
      .from("campaigns")
      .insert({
        subject,
        body_html: bodyHtml,
        preview_text: previewText || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ campaign: data }, { status: 201 });
  } catch (error) {
    console.error("Create campaign error:", error);
    return NextResponse.json(
      { error: "Failed to create campaign." },
      { status: 500 }
    );
  }
}
