import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "Missing unsubscribe token." },
        { status: 400 }
      );
    }

    const { data, error } = await getSupabase()
      .from("subscribers")
      .update({
        status: "unsubscribed",
        unsubscribed_at: new Date().toISOString(),
      })
      .eq("unsubscribe_token", token)
      .eq("status", "active")
      .select("email")
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Invalid or already used unsubscribe link." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "You have been unsubscribed successfully.",
    });
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
