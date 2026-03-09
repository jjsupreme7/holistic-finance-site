"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { IMAGES } from "@/lib/constants";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-end text-white overflow-hidden" role="img" aria-label="Pacific Northwest mountain landscape with lake">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${IMAGES.heroHome})` }}
      />
      <div className="absolute inset-0 bg-foreground/40" />

      <div className="relative z-10 container-site pb-20 md:pb-28 pt-40 w-full">
        <div className="max-w-3xl">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="label text-white/70 mb-6 block"
          >
            Holistic Financial Planning
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="heading-xl font-extralight text-white mb-6"
          >
            Financial Planning
            <br />
            for the Life You Want
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg md:text-xl text-white/70 mb-10 leading-relaxed max-w-lg font-light"
          >
            Personalized financial planning, insurance, and retirement
            services for you and your family in University Place, WA.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
          >
            <Button href="/contact">
              Book Your Consultation &mdash; $59
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
