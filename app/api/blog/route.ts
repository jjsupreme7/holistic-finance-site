import { NextResponse } from "next/server";
import { getPublishedBlogPosts } from "@/lib/blog/server";

export async function GET() {
  try {
    const posts = await getPublishedBlogPosts();
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Public blog list error:", error);
    return NextResponse.json({ error: "Failed to fetch posts." }, { status: 500 });
  }
}
