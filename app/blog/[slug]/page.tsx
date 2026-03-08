"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import FadeIn from "@/components/motion/FadeIn";
import CTABanner from "@/components/sections/CTABanner";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  published_at: string;
}

function renderContent(text: string) {
  return text
    .split(/\n\n+/)
    .filter((p) => p.trim())
    .map((paragraph, i) => {
      const trimmed = paragraph.trim();

      // Headings
      if (trimmed.startsWith("### ")) {
        return (
          <h4 key={i} className="text-lg font-medium text-foreground mt-8 mb-3">
            {trimmed.slice(4)}
          </h4>
        );
      }
      if (trimmed.startsWith("## ")) {
        return (
          <h3 key={i} className="text-xl font-extralight text-foreground mt-10 mb-3">
            {trimmed.slice(3)}
          </h3>
        );
      }
      if (trimmed.startsWith("# ")) {
        return (
          <h2 key={i} className="text-2xl font-extralight text-foreground mt-12 mb-4">
            {trimmed.slice(2)}
          </h2>
        );
      }

      // Bullet lists
      if (trimmed.split("\n").every((line) => line.trim().startsWith("- "))) {
        return (
          <ul key={i} className="list-disc pl-6 space-y-1 text-text-secondary leading-relaxed mb-4">
            {trimmed.split("\n").map((line, j) => (
              <li key={j}>{line.trim().slice(2)}</li>
            ))}
          </ul>
        );
      }

      // Regular paragraph
      return (
        <p key={i} className="text-text-secondary leading-relaxed mb-4">
          {trimmed.split("\n").map((line, j) => (
            <span key={j}>
              {j > 0 && <br />}
              {line}
            </span>
          ))}
        </p>
      );
    });
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/blog/${slug}`)
      .then((res) => {
        if (!res.ok) {
          setNotFound(true);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setPost(data.post);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-border border-t-foreground animate-spin" />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-background pt-24">
        <div className="text-center">
          <h1 className="heading-lg font-extralight text-foreground mb-4">Article Not Found</h1>
          <p className="text-text-secondary mb-8">
            This article doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/blog"
            className="inline-block bg-accent text-foreground font-medium py-3.5 px-8 text-sm uppercase tracking-[0.15em] no-underline transition-colors hover:bg-accent-dark"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
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
              <h1 className="heading-lg font-extralight text-white max-w-3xl">
                {post.title}
              </h1>
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
      />
    </>
  );
}
