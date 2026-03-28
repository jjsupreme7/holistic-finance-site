"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/ui/PageHero";
import FadeIn from "@/components/motion/FadeIn";
import CTABanner from "@/components/sections/CTABanner";
import { BOOKING_URL, IMAGES } from "@/lib/constants";
import { Clock, FileText } from "lucide-react";
import type { PublishedBlogPostSummary } from "@/lib/blog/server";

const POSTS_PER_PAGE = 9;

export default function BlogIndexPage({
  posts,
}: {
  posts: PublishedBlogPostSummary[];
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [brokenImageIds, setBrokenImageIds] = useState<string[]>([]);

  const filtered = useMemo(() => {
    if (!search.trim()) return posts;

    const query = search.toLowerCase();

    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(query))
    );
  }, [posts, search]);

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const markImageBroken = (postId: string) => {
    setBrokenImageIds((current) => (current.includes(postId) ? current : [...current, postId]));
  };

  const hasImage = (post: PublishedBlogPostSummary) =>
    post.cover_image && !brokenImageIds.includes(post.id);

  return (
    <>
      <PageHero
        title="Blog"
        tagline="Public articles, guides, and educational content you can read anytime"
        backgroundImage={IMAGES.heroNewsletter}
      />

      <section className="py-20 px-6">
        <div className="container-site">
          {posts.length === 0 ? (
            <FadeIn>
              <div className="border border-border p-16 text-center max-w-xl mx-auto">
                <h2 className="text-2xl font-extralight text-foreground mb-3">Coming Soon</h2>
                <p className="text-text-secondary">
                  We&apos;re working on new public articles. Subscribe to email updates if you want
                  to be notified when they publish.
                </p>
              </div>
            </FadeIn>
          ) : (
            <>
              {posts.length > 3 && (
                <FadeIn>
                  <div className="mb-12 max-w-md mx-auto">
                    <input
                      type="text"
                      placeholder="Search articles..."
                      value={search}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="w-full px-5 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-text-muted text-sm focus:outline-none focus:border-foreground transition-colors"
                    />
                  </div>
                </FadeIn>
              )}

              {filtered.length === 0 ? (
                <div className="border border-border p-16 text-center max-w-xl mx-auto">
                  <p className="text-text-secondary">
                    No articles found matching &ldquo;{search}&rdquo;
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {paginated.map((post, index) => (
                      <FadeIn key={post.id} delay={index * 0.08}>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="group block no-underline"
                        >
                          {/* Cover image or placeholder */}
                          <div className="h-48 rounded-lg overflow-hidden border border-border group-hover:border-accent transition-colors">
                            {hasImage(post) ? (
                              <div className="relative h-full w-full">
                                <Image
                                  src={post.cover_image!}
                                  alt={post.title}
                                  fill
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                                  onError={() => markImageBroken(post.id)}
                                />
                              </div>
                            ) : (
                              <div className="h-full w-full bg-muted flex items-center justify-center">
                                <FileText className="w-10 h-10 text-text-muted" />
                              </div>
                            )}
                          </div>

                          {/* Post meta */}
                          <div className="pt-4">
                            <p className="flex items-center gap-1.5 text-text-muted text-xs mb-2">
                              <Clock className="w-3.5 h-3.5" />
                              {new Date(post.published_at).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>

                            <h2 className="text-lg font-medium text-foreground group-hover:text-accent transition-colors mb-2">
                              {post.title}
                            </h2>

                            {post.excerpt && (
                              <p className="text-text-secondary text-sm leading-relaxed line-clamp-2 mb-3">
                                {post.excerpt}
                              </p>
                            )}

                            <span className="text-accent text-sm font-medium">
                              Read more &rarr;
                            </span>
                          </div>
                        </Link>
                      </FadeIn>
                    ))}
                  </div>

                  {totalPages > 1 ? (
                    <div className="flex items-center justify-center gap-2 mt-12">
                      <button
                        onClick={() => setPage((current) => Math.max(1, current - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border border-border text-sm text-foreground bg-transparent cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                      >
                        &larr; Prev
                      </button>
                      {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                        (pageNumber) => (
                          <button
                            key={pageNumber}
                            onClick={() => setPage(pageNumber)}
                            className={`w-10 h-10 border text-sm cursor-pointer transition-colors ${
                              pageNumber === page
                                ? "bg-foreground text-background border-foreground"
                                : "bg-transparent text-foreground border-border hover:bg-muted"
                            }`}
                          >
                            {pageNumber}
                          </button>
                        )
                      )}
                      <button
                        onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 border border-border text-sm text-foreground bg-transparent cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                      >
                        Next &rarr;
                      </button>
                    </div>
                  ) : null}
                </>
              )}
            </>
          )}
        </div>
      </section>

      <CTABanner
        title="Want Personalized Financial Advice?"
        text="The blog is for general education. If you want advice tailored to your family, book a consultation."
        buttonText="Book a Consultation"
        buttonHref={BOOKING_URL}
        buttonExternal
      />
    </>
  );
}
