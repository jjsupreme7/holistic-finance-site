import { unstable_noStore as noStore } from "next/cache";
import { getSupabase } from "@/lib/supabase/server";

export interface PublishedBlogPostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  published_at: string;
  updated_at: string | null;
}

export interface PublishedBlogPost extends PublishedBlogPostSummary {
  content: string;
}

export async function getPublishedBlogPosts(): Promise<PublishedBlogPostSummary[]> {
  noStore();

  try {
    const { data, error } = await getSupabase()
      .from("blog_posts")
      .select("id, title, slug, excerpt, cover_image, published_at, updated_at")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Failed to load published blog posts:", error);
    return [];
  }
}

export async function getPublishedBlogPostBySlug(
  slug: string
): Promise<PublishedBlogPost | null> {
  noStore();

  try {
    const { data, error } = await getSupabase()
      .from("blog_posts")
      .select("id, title, slug, excerpt, content, cover_image, published_at, updated_at")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Failed to load blog post for slug "${slug}":`, error);
    return null;
  }
}
