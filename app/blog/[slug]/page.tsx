import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Markdown from "react-markdown";
import { Clock, ArrowLeft } from "lucide-react";
import FadeIn from "@/components/motion/FadeIn";
import CTABanner from "@/components/sections/CTABanner";
import BlogHtmlContent from "@/components/blog/BlogHtmlContent";
import ShareButtons from "@/components/blog/ShareButtons";
import { getPublishedBlogPostBySlug } from "@/lib/blog/server";
import { BOOKING_URL, SITE_NAME } from "@/lib/constants";
import { DEFAULT_SOCIAL_IMAGE } from "@/lib/seo";

function isHtmlContent(content: string): boolean {
  return /^\s*</.test(content);
}

function estimateReadTime(content: string): string {
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 230));
  return `${minutes} min read`;
}

const markdownComponents = {
  h1: (props: React.ComponentProps<"h1">) => (
    <h2 className="text-2xl font-extralight text-foreground mt-12 mb-4" {...props} />
  ),
  h2: (props: React.ComponentProps<"h2">) => (
    <h3 className="text-xl font-extralight text-foreground mt-10 mb-3" {...props} />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h4 className="text-lg font-medium text-foreground mt-8 mb-3" {...props} />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p className="text-text-secondary leading-relaxed mb-4" {...props} />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="list-disc pl-6 space-y-1 text-text-secondary leading-relaxed mb-4" {...props} />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol className="list-decimal pl-6 space-y-1 text-text-secondary leading-relaxed mb-4" {...props} />
  ),
  a: (props: React.ComponentProps<"a">) => (
    <a className="text-accent-dark underline hover:text-accent transition-colors" {...props} />
  ),
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote className="border-l-2 border-accent pl-6 my-6 text-text-secondary italic" {...props} />
  ),
  strong: (props: React.ComponentProps<"strong">) => (
    <strong className="font-medium text-foreground" {...props} />
  ),
};

function buildMetadataDescription(excerpt: string | null, content: string) {
  const fallback = content.replace(/\s+/g, " ").trim().slice(0, 160);
  return excerpt || fallback || `Read this article from ${SITE_NAME}.`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found",
    };
  }

  const description = buildMetadataDescription(post.excerpt, post.content);

  return {
    title: post.title,
    description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      publishedTime: post.published_at,
      images: post.cover_image
        ? [{ url: post.cover_image, alt: post.title }]
        : [{ url: DEFAULT_SOCIAL_IMAGE, alt: `${SITE_NAME} social preview` }],
    },
    twitter: {
      card: post.cover_image ? "summary_large_image" : "summary",
      title: post.title,
      description,
      images: [post.cover_image || DEFAULT_SOCIAL_IMAGE],
    },
  };
}

export const dynamic = "force-dynamic";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const readTime = estimateReadTime(post.content);

  return (
    <>
      {post.cover_image ? (
        <div className="relative h-[50vh] min-h-[400px]">
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-foreground/50" />
          <div className="absolute inset-0 flex items-end">
            <div className="container-site pb-16">
              <FadeIn>
                <div className="flex items-center gap-4 text-sm text-white/60 mb-4">
                  <span>
                    {new Date(post.published_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {readTime}
                  </span>
                </div>
                <h1 className="heading-lg font-extralight text-white max-w-3xl">
                  {post.title}
                </h1>
              </FadeIn>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-foreground pt-32 pb-16 px-6">
          <div className="container-site">
            <FadeIn>
              <div className="flex items-center gap-4 text-sm text-white/60 mb-4">
                <span>
                  {new Date(post.published_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} /> {readTime}
                </span>
              </div>
              <h1 className="heading-lg font-extralight text-white max-w-3xl">{post.title}</h1>
            </FadeIn>
          </div>
        </div>
      )}

      <article className="py-16 px-6">
        <div className="max-w-[720px] mx-auto mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-text-muted text-sm no-underline hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} /> Back to all articles
          </Link>
        </div>

        <div className="max-w-[720px] mx-auto">
          <FadeIn>
            {isHtmlContent(post.content) ? (
              <BlogHtmlContent html={post.content} />
            ) : (
              <Markdown components={markdownComponents}>{post.content}</Markdown>
            )}
          </FadeIn>

          <div className="border-t border-border mt-12 pt-8 flex items-center justify-between">
            <ShareButtons title={post.title} />
          </div>
        </div>
      </article>

      <CTABanner
        title="Ready to Take the Next Step?"
        text="Get personalized financial advice tailored to your family's needs."
        buttonText="Book a Consultation"
        buttonHref={BOOKING_URL}
        buttonExternal
      />
    </>
  );
}
