"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/ui/PageHero";
import FadeIn from "@/components/motion/FadeIn";
import CTABanner from "@/components/sections/CTABanner";
import { BOOKING_URL, IMAGES } from "@/lib/constants";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  published_at: string;
}

const POSTS_PER_PAGE = 9;

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch("/api/blog")
      .then((res) => res.json())
      .then((data) => setPosts(data.posts || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return posts;
    const q = search.toLowerCase();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.excerpt && p.excerpt.toLowerCase().includes(q))
    );
  }, [posts, search]);

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

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
            <>
              {/* Search */}
              {posts.length > 3 && (
                <div className="mb-10 max-w-md">
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-3 border border-border bg-transparent text-foreground placeholder:text-text-muted text-sm focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>
              )}

              {filtered.length === 0 ? (
                <div className="border border-border p-16 text-center max-w-xl mx-auto">
                  <p className="text-text-secondary">
                    No articles found matching &ldquo;{search}&rdquo;
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
                    {paginated.map((post, i) => (
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

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border border-border text-sm text-foreground bg-transparent cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                      >
                        &larr; Prev
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-10 h-10 border text-sm cursor-pointer transition-colors ${
                            p === page
                              ? "bg-foreground text-background border-foreground"
                              : "bg-transparent text-foreground border-border hover:bg-muted"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                      <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 border border-border text-sm text-foreground bg-transparent cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                      >
                        Next &rarr;
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </section>

      <CTABanner
        title="Want Personalized Financial Advice?"
        text="Our articles provide general insights, but nothing beats a one-on-one consultation."
        buttonText="Book a Consultation"
        buttonHref={BOOKING_URL}
        buttonExternal
      />
    </>
  );
}
