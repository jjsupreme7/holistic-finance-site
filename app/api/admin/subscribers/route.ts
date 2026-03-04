import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";

export async function GET() {
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
