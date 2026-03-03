"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { IMAGES, CREDENTIALS } from "@/lib/constants";

export default function HeroSection() {
  return (
    <section
      className="relative min-h-[100vh] flex items-center text-white bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${IMAGES.hero})` }}
    >
      {/* Animated dark gradient overlay */}
      <div className="absolute inset-0 animated-gradient-overlay" />

      {/* Decorative floating orbs */}
      <div className="float-blob w-[500px] h-[500px] bg-primary/25 -top-40 -right-40" />
      <div className="float-blob w-80 h-80 bg-gold/15 bottom-20 -left-20" />
      <div className="float-blob w-48 h-48 bg-primary-light/20 top-1/3 right-1/4" />

      <div className="relative z-10 container-site py-32 w-full">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold/80 bg-gold/10 border border-gold/20 px-4 py-1.5 rounded-full inline-block">
              Personalized Financial Planning
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-[3rem] md:text-[4rem] lg:text-[4.5rem] font-bold text-white mb-6 leading-[1.1]"
          >
            Holistic Health
            <br />
            <span className="text-gradient-gold">and Finance</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-xl text-white/70 mb-10 leading-relaxed max-w-lg"
          >
            Placing family first in finance. Personalized financial planning
            for you and your family.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-wrap gap-4"
          >
            <Button href="/contact">Book Your Consultation &mdash; $59</Button>
            <Button href="/services" variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:border-white/30">
              View Services
            </Button>
          </motion.div>
        </div>

        {/* Floating glass credential chips */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="hidden lg:flex flex-col gap-3 absolute right-6 top-1/2 -translate-y-1/2"
        >
          {CREDENTIALS.slice(0, 4).map((cred, i) => (
            <motion.div
              key={cred.label}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
              className="glass-dark rounded-2xl px-5 py-3 flex items-center gap-3 min-w-[220px]"
            >
              <span className="text-gold">
                <Icon name={cred.icon} size={22} />
              </span>
              <div>
                <div className="text-white text-sm font-bold leading-tight">{cred.label}</div>
                <div className="text-white/50 text-xs">{cred.sub}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
