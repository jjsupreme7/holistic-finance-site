import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";

export async function GET() {
  try {
    const { data, error } = await getSupabase()
      .from("blog_posts")
      .select("id, title, slug, excerpt, cover_image, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ posts: data });
  } catch (error) {
    console.error("Public blog list error:", error);
    return NextResponse.json({ error: "Failed to fetch posts." }, { status: 500 });
  }
}
