import type { Metadata } from "next";
import BlogIndexPage from "@/components/blog/BlogIndexPage";
import { getPublishedBlogPosts } from "@/lib/blog/server";
import { SITE_NAME } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Blog",
  description:
    `Read public articles, guides, and financial education content from ${SITE_NAME}.`,
  path: "/blog",
  keywords: [
    "financial planning blog",
    "retirement articles",
    "tax planning articles",
    "financial education",
  ],
});

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();

  return <BlogIndexPage posts={posts} />;
}
