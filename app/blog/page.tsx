"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/ui/PageHero";
import FadeIn from "@/components/motion/FadeIn";
import CTABanner from "@/components/sections/CTABanner";
import { IMAGES } from "@/lib/constants";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  published_at: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog")
      .then((res) => res.json())
      .then((data) => setPosts(data.posts || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHero
        title="Blog"
        tagline="Financial insights and expert advice"
        backgroundImage={IMAGES.heroNewsletter}
      />

      <section className="py-20 px-6">
        <div className="container-site">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-8 h-8 border-2 border-border border-t-foreground animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <FadeIn>
              <div className="border border-border p-16 text-center max-w-xl mx-auto">
                <h2 className="text-2xl font-extralight text-foreground mb-3">
                  Coming Soon
                </h2>
                <p className="text-text-secondary">
                  We&apos;re working on new articles. Subscribe to our newsletter to be
                  notified when we publish.
                </p>
              </div>
            </FadeIn>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
              {posts.map((post, i) => (
                <FadeIn key={post.id} delay={i * 0.08}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block bg-background group no-underline"
                  >
                    {post.cover_image && (
                      <div className="relative h-52 overflow-hidden">
                        <Image
                          src={post.cover_image}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-8">
                      <p className="label text-text-muted mb-3">
                        {new Date(post.published_at).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <h2 className="text-xl font-extralight text-foreground mb-3 group-hover:text-accent transition-colors">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-text-secondary text-sm leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}
                      <span className="inline-block mt-4 text-text-muted text-sm group-hover:translate-x-1 transition-transform">
                        Read more &rarr;
                      </span>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTABanner
        title="Want Personalized Financial Advice?"
        text="Our articles provide general insights, but nothing beats a one-on-one consultation."
        buttonText="Book a Consultation"
      />
    </>
  );
}
