"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import PageHero from "@/components/ui/PageHero";
import FadeIn from "@/components/motion/FadeIn";
import Icon from "@/components/ui/Icon";
import CTABanner from "@/components/sections/CTABanner";
import { PRODUCTS, IMAGES } from "@/lib/constants";

const categories = ["All", "Apparel", "Wellness", "Drinkware", "Accessories"];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ShopPage() {
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
        title="Shop"
        tagline="Merchandise and wellness products to support your journey"
        backgroundImage={IMAGES.heroShop}
      />

      {/* Featured Product Hero */}
      {featured && (
        <section className="py-16 px-6 relative overflow-hidden">
          <div className="float-blob w-96 h-96 bg-gold/8 -top-32 -right-32" />
          <FadeIn className="container-site">
            <div className="glass-dark rounded-3xl overflow-hidden gradient-border glow-md">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div
                  className="relative min-h-[360px] flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${featured.gradient[0]}, ${featured.gradient[1]})`,
                  }}
                >
                  <span className="absolute top-5 left-5 z-10 text-[10px] font-bold uppercase tracking-[0.2em] text-white bg-primary/70 backdrop-blur-sm px-4 py-1.5 rounded-full">
                    Featured
                  </span>
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    width={400}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                  {featured.brandText && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-gold text-xl md:text-2xl font-bold tracking-[0.25em] uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]" style={{ marginTop: '-5%' }}>
                        {featured.brandText}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-10 md:p-12 flex flex-col justify-center">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold bg-gold/15 px-4 py-1.5 rounded-full inline-block w-fit mb-4">
                    Best Seller
                  </span>
                  <h2 className="text-3xl font-bold text-white mb-2">{featured.title}</h2>
                  <p className="text-3xl font-bold text-gradient-gold mb-4">{featured.price}</p>
                  <p className="text-white/60 leading-relaxed mb-6">{featured.description}</p>

                  {featured.colors && (
                    <div className="mb-5">
                      <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Color</p>
                      <div className="flex gap-2">
                        {featured.colors.map((color, i) => (
                          <button
                            key={i}
                            className="w-8 h-8 rounded-full border-2 border-white shadow-md transition-transform hover:scale-110 cursor-pointer"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {featured.sizes && (
                    <div className="mb-6">
                      <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Size</p>
                      <div className="flex gap-2">
                        {featured.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() =>
                              setSelectedSizes((s) => ({ ...s, [featured.title]: size }))
                            }
                            className={`w-10 h-10 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                              selectedSizes[featured.title] === size
                                ? "bg-dark text-white border-dark"
                                : "bg-white/10 text-white/70 border-white/15 hover:border-white/30"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <Link
                    href="/newsletter"
                    className="flex-1 bg-gradient-to-r from-gold to-gold-dark text-dark font-bold py-3.5 px-6 rounded-full text-sm no-underline text-center hover:shadow-lg hover:shadow-gold/25 transition-all hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
                  >
                    <Icon name="bell" size={16} />
                    Notify Me When Available
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>
      )}

      {/* Category Filters + Product Grid */}
      <section className="py-16 px-6 mesh-gradient-dark relative overflow-hidden">
        <div className="float-blob w-64 h-64 bg-primary/8 bottom-10 -left-10" />
        <div className="container-site">
          <FadeIn className="text-center mb-10">
            <h2 className="text-[2.25rem] font-bold text-white mb-6">All Products</h2>
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all border cursor-pointer ${
                    activeCategory === cat
                      ? "bg-dark text-white border-dark shadow-lg"
                      : "glass-dark border-white/15 text-white/60 hover:text-white hover:border-white/30"
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
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7"
            >
              {filtered.map((product) => (
                <motion.div
                  key={product.title}
                  variants={item}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="glass-dark rounded-2xl overflow-hidden gradient-border glow-sm hover:glow-md transition-all duration-300 group"
                >
                  {/* Product image area */}
                  <div
                    className="relative h-64 overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${product.gradient[0]}, ${product.gradient[1]})`,
                    }}
                  >
                    <span className="absolute top-3 left-3 z-10 text-[10px] font-bold uppercase tracking-wider text-white bg-dark/60 backdrop-blur-sm px-3 py-1 rounded-full">
                      {product.category}
                    </span>
                    <Image
                      src={product.image}
                      alt={product.title}
                      width={400}
                      height={300}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.brandText && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-gold text-sm font-bold tracking-[0.2em] uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]" style={{ marginTop: '-5%' }}>
                          {product.brandText}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product details */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-base font-bold text-white leading-tight pr-2">
                        {product.title}
                      </h3>
                      <span className="text-lg font-bold text-gradient-gold flex-shrink-0">
                        {product.price}
                      </span>
                    </div>

                    <p className="text-white/60 text-sm leading-relaxed mb-4">
                      {product.description}
                    </p>

                    {/* Color swatches */}
                    {product.colors && (
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">
                          Colors
                        </span>
                        <div className="flex gap-1.5">
                          {product.colors.map((color, i) => (
                            <span
                              key={i}
                              className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Size selector */}
                    {product.sizes && (
                      <div className="flex gap-1.5 mb-4">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() =>
                              setSelectedSizes((s) => ({ ...s, [product.title]: size }))
                            }
                            className={`w-8 h-8 rounded-md text-[10px] font-bold transition-all border cursor-pointer ${
                              selectedSizes[product.title] === size
                                ? "bg-dark text-white border-dark"
                                : "bg-white/10 text-white/50 border-white/15 hover:border-white/30"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    )}

                    <Link
                      href="/newsletter"
                      className="w-full bg-primary/15 hover:bg-primary/20 text-primary-light font-bold py-3 px-6 rounded-full text-sm no-underline transition-colors inline-flex items-center justify-center gap-2"
                    >
                      <Icon name="bell" size={14} />
                      Notify Me When Available
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Newsletter CTA */}
          <FadeIn className="mt-16">
            <div className="glass-dark rounded-3xl p-10 md:p-14 text-center max-w-2xl mx-auto relative overflow-hidden">
              <div className="float-blob w-48 h-48 bg-gold/20 -top-10 -right-10" />
              <div className="relative z-10">
                <div className="text-gold mb-4 flex justify-center">
                  <Icon name="bell" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Get Notified When We Launch
                </h3>
                <p className="text-white/50 mb-8 max-w-md mx-auto">
                  Be the first to shop our collection. Subscribe to our newsletter and get an
                  exclusive early-bird discount.
                </p>
                <a
                  href="/newsletter"
                  className="inline-block bg-gradient-to-r from-gold to-gold-dark text-dark font-bold py-3.5 px-10 rounded-full no-underline hover:shadow-xl hover:shadow-gold/25 transition-all hover:-translate-y-1"
                >
                  Subscribe for Early Access
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <CTABanner
        title="Have Product Ideas?"
        text="We'd love to hear what merchandise you'd like to see. Drop us a message!"
        buttonText="Contact Us"
      />
    </>
  );
}
