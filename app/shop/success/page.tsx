import FadeIn from "@/components/motion/FadeIn";
import CTABanner from "@/components/sections/CTABanner";
import Button from "@/components/ui/Button";
import PageHero from "@/components/ui/PageHero";
import { IMAGES } from "@/lib/constants";

export default function ShopSuccessPage() {
  return (
    <>
      <PageHero
        title="Order Received"
        tagline="Your Stripe checkout was completed successfully"
        backgroundImage={IMAGES.heroShop}
      />

      <section className="py-16 px-6 bg-muted">
        <FadeIn className="container-site">
          <div className="max-w-2xl mx-auto border border-border bg-background p-10 md:p-12 text-center">
            <span className="inline-block label text-accent mb-4">Thank You</span>
            <h2 className="text-3xl font-extralight text-foreground mb-4">
              Your order is on the way into fulfillment.
            </h2>
            <p className="text-text-secondary leading-relaxed mb-8">
              Stripe will email your receipt directly. If you need to update anything about the
              order, reach out through the contact page and we can follow up.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button href="/shop">Continue Shopping</Button>
              <Button href="/contact" variant="outline">
                Contact Us
              </Button>
            </div>
          </div>
        </FadeIn>
      </section>

      <CTABanner
        title="Want Updates Too?"
        text="Subscribe for new product drops, class announcements, and community events."
        buttonText="Email Updates"
        buttonHref="/newsletter"
      />
    </>
  );
}
