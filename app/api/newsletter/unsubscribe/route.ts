import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { guardPublicPostRoute } from "@/lib/public-route";

export async function POST(req: Request) {
  try {
    const blocked = guardPublicPostRoute(req, {
      key: "newsletter-unsubscribe",
      limit: 10,
      windowMs: 10 * 60_000,
      message: "Too many unsubscribe attempts. Please wait a few minutes and try again.",
    });
    if (blocked) {
      return blocked;
    }

    const { token } = await req.json();

    if (typeof token !== "string" || !token.trim()) {
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
      .eq("unsubscribe_token", token.trim())
      .eq("status", "active")
      .select("email")
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
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
