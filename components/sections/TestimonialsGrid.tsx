"use client";

import FadeIn from "@/components/motion/FadeIn";
import SectionHeader from "@/components/ui/SectionHeader";
import { TESTIMONIALS } from "@/lib/constants";

export default function TestimonialsGrid() {
  return (
    <section className="py-24 px-6" role="region" aria-label="Client testimonials">
      <div className="container-site">
        <SectionHeader
          label="Testimonials"
          title="What Our Clients Say"
        />
        <div className="max-w-3xl">
          {TESTIMONIALS.map((t, i) => (
            <FadeIn key={t.author} delay={i * 0.1}>
              <div className={`py-10 ${i < TESTIMONIALS.length - 1 ? "border-b border-border" : ""}`}>
                <p className="text-xl md:text-2xl font-light text-foreground leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <span className="label text-text-muted">
                  {t.author}
                </span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
