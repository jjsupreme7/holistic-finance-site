import type { Metadata } from "next";
import BlogIndexPage from "@/components/blog/BlogIndexPage";
import { getPublishedBlogPosts } from "@/lib/blog/server";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Blog",
  description:
    `Read public articles, guides, and financial education content from ${SITE_NAME}.`,
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();

  return <BlogIndexPage posts={posts} />;
}
