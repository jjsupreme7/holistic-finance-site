import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import FadeIn from "@/components/motion/FadeIn";
import CTABanner from "@/components/sections/CTABanner";
import NewsletterForm from "@/components/sections/NewsletterForm";
import { RESOURCES, IMAGES, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Newsletter & Resources",
  description:
    `Subscribe to the ${SITE_NAME} newsletter for expert financial insights, strategies, and the latest updates on financial planning.`,
};

export default function NewsletterPage() {
  return (
    <>
      <PageHero title="Newsletter & Resources" tagline="Stay informed. Stay ahead." backgroundImage={IMAGES.heroNewsletter} />

      <section className="py-20 px-6">
        <div className="container-site grid grid-cols-1 md:grid-cols-[1fr_380px] lg:grid-cols-[1fr_400px] gap-12">
          <FadeIn direction="left">
            <div className="space-y-7">
              <div>
                <span className="label text-text-muted block mb-5">
                  Stay Informed
                </span>
                <h2 className="heading-lg font-extralight text-foreground mb-6">Why Subscribe?</h2>
              </div>
              <p className="text-text-secondary leading-relaxed text-lg">
                In today&apos;s ever-changing financial landscape, staying informed is more
                important than ever. Markets shift rapidly, new regulations emerge, and economic
                trends evolve &mdash; factors that can significantly impact your financial
                well-being.
              </p>
              <p className="text-text-secondary leading-relaxed">
                Subscribing to our financial planning newsletter ensures you stay ahead of these
                changes with expert insights, actionable strategies, and the latest updates
                tailored to help you maintain financial literacy and build sustainable wealth.
              </p>
              <p className="text-text-secondary leading-relaxed">
                Empower yourself to make informed decisions, adapt to market dynamics, and secure
                your financial longevity. Join our community and take control of your financial
                future.
              </p>

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
              <h3 className="text-xl font-extralight text-foreground mb-3">Subscribe to Our Newsletter</h3>
              <p className="text-text-secondary text-sm mb-6">
                Stay informed with expert financial insights and updates delivered to your inbox.
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
        text="Our newsletter is great for general insights, but nothing beats a one-on-one consultation."
        buttonText="Book a Consultation"
      />
    </>
  );
}
