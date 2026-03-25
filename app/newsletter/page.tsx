import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import FadeIn from "@/components/motion/FadeIn";
import CTABanner from "@/components/sections/CTABanner";
import NewsletterForm from "@/components/sections/NewsletterForm";
import { BOOKING_URL, RESOURCES, IMAGES, SITE_NAME } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Email Updates & Resources",
  description:
    `Subscribe for ${SITE_NAME} email updates, including new classes, event announcements, product launch alerts, and helpful financial resources.`,
  path: "/newsletter",
  keywords: [
    "newsletter signup",
    "financial updates",
    "event announcements",
    "financial resources",
  ],
});

export default function NewsletterPage() {
  return (
    <>
      <PageHero
        title="Email Updates & Resources"
        tagline="Announcements, class launches, event alerts, and helpful financial links"
        backgroundImage={IMAGES.heroNewsletter}
      />

      <section className="py-20 px-6">
        <div className="container-site grid grid-cols-1 md:grid-cols-[1fr_380px] lg:grid-cols-[1fr_400px] gap-12">
          <FadeIn direction="left">
            <div className="space-y-7">
              <div>
                <span className="label text-text-muted block mb-5">
                  Inbox Updates
                </span>
                <h2 className="heading-lg font-extralight text-foreground mb-6">What You&apos;ll Receive</h2>
              </div>
              <p className="text-text-secondary leading-relaxed text-lg">
                This page is not meant to replace the blog. The blog is where public articles live.
                The email list is for people who want highlights and announcements sent directly to
                their inbox.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border border border-border">
                {[
                  {
                    title: "New blog posts",
                    text: "Get notified when new educational articles are published on the site.",
                  },
                  {
                    title: "Class and event announcements",
                    text: "Hear first about new course dates, workshops, and community events.",
                  },
                  {
                    title: "Shop launch alerts",
                    text: "Be notified when merchandise and checkout finally go live.",
                  },
                  {
                    title: "Helpful resources",
                    text: "Receive occasional links, reminders, and financial planning updates worth saving.",
                  },
                ].map((item) => (
                  <div key={item.title} className="bg-background p-6">
                    <h3 className="text-lg font-extralight text-foreground mb-2">{item.title}</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>

              <div className="border border-border p-6">
                <span className="label text-text-muted block mb-3">Prefer Reading On-Site?</span>
                <p className="text-text-secondary leading-relaxed mb-4">
                  Visit the blog if you want full-length public articles you can browse anytime
                  without subscribing.
                </p>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-foreground font-medium no-underline group text-sm uppercase tracking-[0.15em]"
                >
                  Visit the Blog
                  <span className="inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
                </Link>
              </div>

              <div className="pt-6">
                <h2 className="heading-lg font-extralight text-foreground mb-6">Resources</h2>
                <div className="space-y-0">
                  {RESOURCES.map((r) => (
                    <a
                      key={r.label}
                      href={r.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-b border-border p-4 flex items-center justify-between no-underline group hover:bg-muted transition-colors block"
                    >
                      <span className="text-foreground font-medium group-hover:text-accent transition-colors">{r.label}</span>
                      <span className="text-text-muted group-hover:translate-x-1 transition-transform inline-block">&rarr;</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="right">
            <div className="border border-border p-8 h-fit sticky top-28">
              <h3 className="text-xl font-extralight text-foreground mb-3">Subscribe for Email Updates</h3>
              <p className="text-text-secondary text-sm mb-6">
                Get announcements, launch notices, article highlights, and event updates delivered
                to your inbox.
              </p>
              <NewsletterForm />
              <p className="text-text-muted text-xs text-center mt-4">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <CTABanner
        title="Want Personalized Advice?"
        text="Email updates keep you informed, but a one-on-one consultation is still the best way to get advice tailored to your family."
        buttonText="Book a Consultation"
        buttonHref={BOOKING_URL}
        buttonExternal
      />
    </>
  );
}
