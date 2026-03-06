"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { IMAGES } from "@/lib/constants";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center text-white overflow-hidden">
      {/* PNW nature background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${IMAGES.heroHome})` }}
      />
      <div className="absolute inset-0 hero-nature-overlay" />
      {/* Dot grid overlay for depth */}
      <div className="absolute inset-0 dot-grid" />

      <div className="float-blob w-[600px] h-[600px] bg-primary/25 -top-48 -right-48" />
      <div className="float-blob w-96 h-96 bg-gold/12 bottom-20 -left-24" />
      <div className="float-blob w-72 h-72 bg-forest/15 top-1/2 left-1/2" />

      <div className="relative z-10 container-site py-32 w-full">
        <div className="max-w-2xl mx-auto text-center">
          {/* Trust pill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-gold bg-gold/10 border border-gold/20 px-5 py-2 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              Trusted by 500+ Families
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7 }}
            className="text-[2.75rem] md:text-[3.5rem] lg:text-[4.25rem] font-bold text-white mb-6 leading-[1.1]"
          >
            Financial Planning
            <br />
            <span className="text-gradient-gold">for the Life You Want</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-white/70 mb-10 leading-relaxed max-w-lg mx-auto"
          >
            Personalized financial planning, insurance, and retirement
            services for you and your family in University Place, WA.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button href="/contact" className="text-base px-8 py-4">
              Book Your Consultation &mdash; $59
            </Button>
            <Button href="/services" variant="outline" className="text-base px-8 py-4">
              Explore Services
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="mt-12 flex items-center justify-center gap-6 text-white/40 text-sm"
          >
            <span>11+ Years</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>CPMA Certified</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>500+ Families</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
