import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { getSupabase } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const { data, error } = await getSupabase()
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ posts: data });
  } catch (error) {
    console.error("Blog list error:", error);
    return NextResponse.json({ error: "Failed to fetch posts." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = await req.json();
    const { title, slug, excerpt, content, coverImage, status } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required." },
        { status: 400 }
      );
    }

    const postData: Record<string, unknown> = {
      title: title.trim(),
      slug: slug.trim().toLowerCase(),
      excerpt: excerpt?.trim() || null,
      content,
      cover_image: coverImage?.trim() || null,
      status: status || "draft",
    };

    if (status === "published") {
      postData.published_at = new Date().toISOString();
    }

    const { data, error } = await getSupabase()
      .from("blog_posts")
      .insert(postData)
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "A post with this slug already exists." },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json({ post: data }, { status: 201 });
  } catch (error) {
    console.error("Blog create error:", error);
    return NextResponse.json({ error: "Failed to create post." }, { status: 500 });
  }
}
