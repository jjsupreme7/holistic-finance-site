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
      .from("blog_posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    return NextResponse.json({ post: data });
  } catch (error) {
    console.error("Blog get error:", error);
    return NextResponse.json({ error: "Failed to fetch post." }, { status: 500 });
  }
}

export async function PUT(
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
    const { title, slug, excerpt, content, coverImage, status } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required." },
        { status: 400 }
      );
    }

    // Get current post to check if status is changing to published
    const { data: existing } = await getSupabase()
      .from("blog_posts")
      .select("status, published_at")
      .eq("id", id)
      .single();

    const updateData: Record<string, unknown> = {
      title: title.trim(),
      slug: slug.trim().toLowerCase(),
      excerpt: excerpt?.trim() || null,
      content,
      cover_image: coverImage?.trim() || null,
      status: status || "draft",
      updated_at: new Date().toISOString(),
    };

    // Set published_at when first published
    if (status === "published" && existing?.status !== "published") {
      updateData.published_at = new Date().toISOString();
    }

    const { data, error } = await getSupabase()
      .from("blog_posts")
      .update(updateData)
      .eq("id", id)
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

    return NextResponse.json({ post: data });
  } catch (error) {
    console.error("Blog update error:", error);
    return NextResponse.json({ error: "Failed to update post." }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const { id } = await params;
    const { error } = await getSupabase()
      .from("blog_posts")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Blog delete error:", error);
    return NextResponse.json({ error: "Failed to delete post." }, { status: 500 });
  }
}
