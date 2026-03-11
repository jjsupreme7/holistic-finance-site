import FadeIn from "@/components/motion/FadeIn";
import CTABanner from "@/components/sections/CTABanner";
import Button from "@/components/ui/Button";
import PageHero from "@/components/ui/PageHero";
import { IMAGES } from "@/lib/constants";

export default function ShopCancelPage() {
  return (
    <>
      <PageHero
        title="Checkout Paused"
        tagline="Your cart is still waiting whenever you are ready"
        backgroundImage={IMAGES.heroShop}
      />

      <section className="py-16 px-6 bg-muted">
        <FadeIn className="container-site">
          <div className="max-w-2xl mx-auto border border-border bg-background p-10 md:p-12 text-center">
            <span className="inline-block label text-accent mb-4">No Problem</span>
            <h2 className="text-3xl font-extralight text-foreground mb-4">
              You can head back to the shop at any time.
            </h2>
            <p className="text-text-secondary leading-relaxed mb-8">
              If you were just browsing, nothing was charged. Return to the product page when you
              are ready, or subscribe for alerts about future merchandise drops.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button href="/shop">Return to Shop</Button>
              <Button href="/newsletter" variant="outline">
                Get Product Updates
              </Button>
            </div>
          </div>
        </FadeIn>
      </section>

      <CTABanner
        title="Questions Before Ordering?"
        text="We can help with product questions, availability, or launch timing."
        buttonText="Contact Us"
        buttonHref="/contact"
      />
    </>
  );
}
