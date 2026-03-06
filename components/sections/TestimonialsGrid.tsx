"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import { TESTIMONIALS, IMAGES } from "@/lib/constants";

const stars = Array(5).fill("\u2605");

export default function TestimonialsGrid() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const advance = useCallback(() => {
    setCurrent((c) => (c + 1) % TESTIMONIALS.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(advance, 10000);
    return () => clearInterval(timer);
  }, [paused, advance]);

  return (
    <section
      className="py-20 px-6 relative overflow-hidden"
      role="region"
      aria-label="Client testimonials"
      style={{ backgroundImage: `url(${IMAGES.bgForestCanopy})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-dark/90" />
      <div className="float-blob w-64 h-64 bg-gold/8 top-10 right-20" />
      <div className="container-site">
        <SectionHeader title="What Our Clients Say" />

        {/* Carousel */}
        <div
          className="max-w-2xl mx-auto mb-12"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="glass-dark rounded-3xl p-10 md:p-14 gradient-border glow-sm relative min-h-[280px] flex flex-col justify-center">
            <div className="text-5xl text-gold/20 font-heading absolute top-6 left-8">&#10077;</div>
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
                className="relative z-10"
                aria-live="polite"
              >
                <div className="flex gap-1 mb-4 justify-center" aria-label={`Rating: 5 out of 5 stars`}>
                  {stars.map((s, i) => (
                    <span key={i} className="text-gold text-lg" aria-hidden="true">{s}</span>
                  ))}
                </div>
                <p className="text-white text-lg md:text-xl leading-relaxed mb-8 text-center italic">
                  &ldquo;{TESTIMONIALS[current].quote}&rdquo;
                </p>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold text-base">
                    {TESTIMONIALS[current].author[0]}
                  </div>
                  <div>
                    <p className="text-white font-bold">{TESTIMONIALS[current].author}</p>
                    <p className="text-white/40 text-sm">Verified Client</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6" role="tablist" aria-label="Testimonial navigation">
            {TESTIMONIALS.map((t, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                role="tab"
                aria-selected={i === current}
                aria-label={`Testimonial from ${t.author}`}
                className={`w-2.5 h-2.5 rounded-full transition-all border-none cursor-pointer ${
                  i === current
                    ? "bg-gold w-8"
                    : "bg-white/15 hover:bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Small cards below */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.button
              key={t.author}
              onClick={() => setCurrent(i)}
              whileHover={{ y: -4 }}
              className={`glass-dark rounded-2xl p-6 text-left border-none cursor-pointer transition-all ${
                i === current ? "glow-md ring-2 ring-gold/20 glow-gold" : "opacity-70 hover:opacity-100"
              }`}
            >
              <div className="flex gap-1 mb-2">
                {stars.map((s, j) => (
                  <span key={j} className="text-gold text-xs" aria-hidden="true">{s}</span>
                ))}
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-3 line-clamp-2 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold text-[10px]">
                  {t.author[0]}
                </div>
                <span className="text-white font-bold text-xs">{t.author}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
