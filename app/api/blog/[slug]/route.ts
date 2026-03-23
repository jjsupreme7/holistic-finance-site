import { NextResponse } from "next/server";
import { getPublishedBlogPostBySlug } from "@/lib/blog/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = await getPublishedBlogPostBySlug(slug);

    if (!post) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Public blog post error:", error);
    return NextResponse.json({ error: "Failed to fetch post." }, { status: 500 });
  }
}
