import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import FadeIn from "@/components/motion/FadeIn";
import CTABanner from "@/components/sections/CTABanner";
import { getPublishedBlogPostBySlug } from "@/lib/blog/server";
import { BOOKING_URL, SITE_NAME } from "@/lib/constants";

function renderContent(text: string) {
  return text
    .split(/\n\n+/)
    .filter((paragraph) => paragraph.trim())
    .map((paragraph, index) => {
      const trimmed = paragraph.trim();

      if (trimmed.startsWith("### ")) {
        return (
          <h4 key={index} className="text-lg font-medium text-foreground mt-8 mb-3">
            {trimmed.slice(4)}
          </h4>
        );
      }

      if (trimmed.startsWith("## ")) {
        return (
          <h3 key={index} className="text-xl font-extralight text-foreground mt-10 mb-3">
            {trimmed.slice(3)}
          </h3>
        );
      }

      if (trimmed.startsWith("# ")) {
        return (
          <h2 key={index} className="text-2xl font-extralight text-foreground mt-12 mb-4">
            {trimmed.slice(2)}
          </h2>
        );
      }

      if (trimmed.split("\n").every((line) => line.trim().startsWith("- "))) {
        return (
          <ul
            key={index}
            className="list-disc pl-6 space-y-1 text-text-secondary leading-relaxed mb-4"
          >
            {trimmed.split("\n").map((line, lineIndex) => (
              <li key={lineIndex}>{line.trim().slice(2)}</li>
            ))}
          </ul>
        );
      }

      return (
        <p key={index} className="text-text-secondary leading-relaxed mb-4">
          {trimmed.split("\n").map((line, lineIndex) => (
            <span key={lineIndex}>
              {lineIndex > 0 ? <br /> : null}
              {line}
            </span>
          ))}
        </p>
      );
    });
}

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
      images: post.cover_image ? [{ url: post.cover_image, alt: post.title }] : undefined,
    },
    twitter: {
      card: post.cover_image ? "summary_large_image" : "summary",
      title: post.title,
      description,
      images: post.cover_image ? [post.cover_image] : undefined,
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
                <p className="label text-white/70 mb-4">
                  {new Date(post.published_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
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
              <p className="label text-white/50 mb-4">
                {new Date(post.published_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <h1 className="heading-lg font-extralight text-white max-w-3xl">{post.title}</h1>
            </FadeIn>
          </div>
        </div>
      )}

      <article className="py-16 px-6">
        <div className="max-w-[720px] mx-auto">
          <FadeIn>{renderContent(post.content)}</FadeIn>

          <div className="border-t border-border mt-16 pt-8">
            <Link
              href="/blog"
              className="text-text-muted text-sm no-underline hover:text-foreground transition-colors"
            >
              &larr; Back to all articles
            </Link>
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
