import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { getSupabase } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const { data, error } = await getSupabase()
      .from("subscribers")
      .select("id, email, first_name, subscribed_at, unsubscribed_at, status")
      .order("subscribed_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ subscribers: data });
  } catch (error) {
    console.error("Fetch subscribers error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscribers." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Missing subscriber id." }, { status: 400 });
    }

    const { error } = await getSupabase()
      .from("subscribers")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete subscriber error:", error);
    return NextResponse.json(
      { error: "Failed to delete subscriber." },
      { status: 500 }
    );
  }
}
