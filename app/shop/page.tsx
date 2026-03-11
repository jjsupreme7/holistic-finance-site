"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import PageHero from "@/components/ui/PageHero";
import FadeIn from "@/components/motion/FadeIn";
import Icon from "@/components/ui/Icon";
import CTABanner from "@/components/sections/CTABanner";
import CheckoutButton from "@/components/shop/CheckoutButton";
import { PRODUCTS, PRODUCT_CATEGORIES, IMAGES } from "@/lib/constants";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function ShopPage() {
  const checkoutEnabled = process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_ENABLED === "true";
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});

  const filtered =
    activeCategory === "All"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

  const featured = PRODUCTS.find((p) => p.featured);

  return (
    <>
      <PageHero
        title={checkoutEnabled ? "Shop" : "Shop Preview"}
        tagline={
          checkoutEnabled
            ? "Secure Stripe checkout is ready for merchandise orders"
            : "A preview of future merchandise while Stripe checkout is still being finalized"
        }
        backgroundImage={IMAGES.heroShop}
      />

      <section className="py-12 px-6 border-b border-border bg-muted">
        <FadeIn className="container-site">
          <div className="max-w-[900px] mx-auto text-center border border-border bg-background p-8 md:p-10">
            <span className="inline-block label text-accent mb-4">
              {checkoutEnabled ? "Storefront Live" : "Storefront Preview"}
            </span>
            <h2 className="text-3xl font-extralight text-foreground mb-4">
              {checkoutEnabled ? "Secure Checkout Is Ready" : "Checkout Is Not Live Yet"}
            </h2>
            <p className="text-text-secondary leading-relaxed mb-6">
              {checkoutEnabled
                ? "Browse the current merchandise collection and head into Stripe Checkout when you are ready to order. Shipping rates can be added in the Stripe dashboard as soon as they are finalized."
                : "The shop is currently a preview collection while Stripe checkout and shipping are still being finalized. Browse the product direction below and join the waitlist for launch updates."}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="text-sm font-medium border border-border px-4 py-2 text-foreground">
                {checkoutEnabled ? "Stripe Checkout connected" : "Stripe checkout coming soon"}
              </span>
              <span className="text-sm font-medium border border-border px-4 py-2 text-foreground">
                {checkoutEnabled ? "Email updates still available" : "Early-access list open"}
              </span>
            </div>
          </div>
        </FadeIn>
      </section>

      {featured && (
        <section className="py-16 px-6">
          <FadeIn className="container-site">
            <div className="border border-border overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div
                  className="relative min-h-[360px] flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${featured.gradient[0]}, ${featured.gradient[1]})`,
                  }}
                >
                  <span className="absolute top-5 left-5 z-10 label text-foreground bg-background px-4 py-1.5">
                    Featured
                  </span>
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    width={400}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-10 md:p-12 flex flex-col justify-center">
                  <span className="label text-accent mb-4 block">
                    {checkoutEnabled ? "Featured Item" : "Preview Item"}
                  </span>
                  <h2 className="text-3xl font-extralight text-foreground mb-2">{featured.title}</h2>
                  <p className="text-3xl font-extralight text-accent mb-4">{featured.price}</p>
                  <p className="text-text-secondary leading-relaxed mb-6">{featured.description}</p>

                  {featured.colors && (
                    <div className="mb-5">
                      <p className="label text-text-muted mb-2">Color</p>
                      <div className="flex gap-2">
                        {featured.colors.map((color, i) => (
                          <button
                            key={i}
                            className="w-8 h-8 border border-border transition-transform hover:scale-110 cursor-pointer"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {featured.sizes && (
                    <div className="mb-6">
                      <p className="label text-text-muted mb-2">Size</p>
                      <div className="flex gap-2">
                        {featured.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() =>
                              setSelectedSizes((s) => ({ ...s, [featured.title]: size }))
                            }
                            className={`w-10 h-10 text-xs font-medium transition-all border cursor-pointer ${
                              selectedSizes[featured.title] === size
                                ? "bg-foreground text-background border-foreground"
                                : "bg-background text-text-secondary border-border hover:border-foreground"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {checkoutEnabled ? (
                    <div className="space-y-4">
                      <CheckoutButton
                        productSlug={featured.slug}
                        productTitle={featured.title}
                        selectedSize={selectedSizes[featured.title]}
                        requiresSize={Boolean(featured.sizes?.length)}
                        className="bg-accent text-foreground font-medium py-3.5 px-6 text-sm hover:bg-accent-dark transition-colors w-full sm:w-auto"
                      />
                      <Link
                        href="/newsletter"
                        className="border border-border text-foreground font-medium py-3.5 px-6 text-sm no-underline text-center hover:bg-muted transition-colors inline-flex items-center justify-center gap-2 w-full sm:w-auto"
                      >
                        <Icon name="bell" size={16} />
                        Email Me Product Updates
                      </Link>
                    </div>
                  ) : (
                    <Link
                      href="/newsletter"
                      className="bg-accent text-foreground font-medium py-3.5 px-6 text-sm no-underline text-center hover:bg-accent-dark transition-colors inline-flex items-center justify-center gap-2"
                    >
                      <Icon name="bell" size={16} />
                      Join the Waitlist
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </FadeIn>
        </section>
      )}

      <section className="py-16 px-6 bg-muted">
        <div className="container-site">
          <FadeIn className="text-center mb-10">
            <h2 className="heading-lg font-extralight text-foreground mb-6">
              {checkoutEnabled ? "Collection" : "Preview Collection"}
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              {PRODUCT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 text-sm font-medium transition-all border cursor-pointer ${
                    activeCategory === cat
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background border-border text-text-secondary hover:text-foreground hover:border-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </FadeIn>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              variants={container}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border"
            >
              {filtered.map((product) => (
                <motion.div
                  key={product.slug}
                  variants={item}
                  className="bg-muted overflow-hidden group"
                >
                  <div
                    className="relative h-64 overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${product.gradient[0]}, ${product.gradient[1]})`,
                    }}
                  >
                    <span className="absolute top-3 left-3 z-10 label text-foreground bg-background/90 px-3 py-1">
                      {product.category}
                    </span>
                    <Image
                      src={product.image}
                      alt={product.title}
                      width={400}
                      height={300}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-base font-medium text-foreground leading-tight pr-2">
                        {product.title}
                      </h3>
                      <span className="text-lg font-extralight text-foreground flex-shrink-0">
                        {product.price}
                      </span>
                    </div>

                    <p className="text-text-secondary text-sm leading-relaxed mb-4">
                      {product.description}
                    </p>

                    {product.colors && (
                      <div className="flex items-center gap-3 mb-4">
                        <span className="label text-text-muted">
                          Colors
                        </span>
                        <div className="flex gap-1.5">
                          {product.colors.map((color, i) => (
                            <span
                              key={i}
                              className="w-5 h-5 border border-border"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {product.sizes && (
                      <div className="flex gap-1.5 mb-4">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() =>
                              setSelectedSizes((s) => ({ ...s, [product.title]: size }))
                            }
                            className={`w-8 h-8 text-[10px] font-medium transition-all border cursor-pointer ${
                              selectedSizes[product.title] === size
                                ? "bg-foreground text-background border-foreground"
                                : "bg-background text-text-muted border-border hover:border-foreground"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    )}

                    {checkoutEnabled ? (
                      <div className="space-y-3">
                        <CheckoutButton
                          productSlug={product.slug}
                          productTitle={product.title}
                          selectedSize={selectedSizes[product.title]}
                          requiresSize={Boolean(product.sizes?.length)}
                          className="w-full bg-foreground text-background font-medium py-3 px-6 text-sm transition-colors hover:bg-foreground/80"
                        />
                        <Link
                          href="/newsletter"
                          className="w-full border border-border text-foreground font-medium py-3 px-6 text-sm no-underline transition-colors hover:bg-background inline-flex items-center justify-center gap-2"
                        >
                          <Icon name="bell" size={14} />
                          Launch Alerts
                        </Link>
                      </div>
                    ) : (
                      <Link
                        href="/newsletter"
                        className="w-full bg-foreground text-background font-medium py-3 px-6 text-sm no-underline transition-colors hover:bg-foreground/80 inline-flex items-center justify-center gap-2"
                      >
                        <Icon name="bell" size={14} />
                        Join the Waitlist
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          <FadeIn className="mt-16">
            <div className="border border-border p-10 md:p-14 text-center max-w-2xl mx-auto bg-background">
              <div className="text-accent mb-4 flex justify-center">
                <Icon name="bell" size={32} />
              </div>
              <h3 className="text-2xl font-extralight text-foreground mb-3">
                {checkoutEnabled ? "Stay In The Loop" : "Get Notified When We Launch"}
              </h3>
              <p className="text-text-secondary mb-8 max-w-md mx-auto">
                {checkoutEnabled
                  ? "Subscribe for future product drops, workshop announcements, and special offers."
                  : "Be the first to shop our collection. Subscribe to our newsletter and get an exclusive early-bird discount."}
              </p>
              <a
                href="/newsletter"
                className="inline-block bg-accent text-foreground font-medium py-3.5 px-10 no-underline hover:bg-accent-dark transition-colors text-sm uppercase tracking-[0.15em]"
              >
                {checkoutEnabled ? "Subscribe for Product Updates" : "Subscribe for Early Access"}
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      <CTABanner
        title="Have Product Ideas?"
        text="We'd love to hear what merchandise you'd like to see. Drop us a message!"
        buttonText="Contact Us"
        buttonHref="/contact"
      />
    </>
  );
}
