import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { data, error } = await getSupabase()
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    return NextResponse.json({ post: data });
  } catch (error) {
    console.error("Public blog post error:", error);
    return NextResponse.json({ error: "Failed to fetch post." }, { status: 500 });
  }
}
