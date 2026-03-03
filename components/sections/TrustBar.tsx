"use client";

import { motion } from "framer-motion";

const badges = [
  { label: "CPMA Certified", sub: "Professional Medical Auditor" },
  { label: "Licensed Agent", sub: "Health & Life Insurance" },
  { label: "Transamerica", sub: "Partner Agent" },
  { label: "WA State Licensed", sub: "Insurance Producer" },
  { label: "HIPAA Compliant", sub: "Data Protection" },
];

export default function TrustBar() {
  return (
    <section className="py-6 px-6 border-y border-border-light/50 bg-white/40 backdrop-blur-sm relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-[1200px] mx-auto"
      >
        <div className="flex items-center justify-center gap-8 md:gap-14 flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
            Trusted By
          </span>
          {badges.map((badge) => (
            <div key={badge.label} className="flex items-center gap-2.5 group">
              <div className="w-2 h-2 rounded-full bg-gradient-to-br from-gold to-gold-dark group-hover:scale-125 transition-transform" />
              <div>
                <p className="text-xs font-bold text-dark leading-tight">{badge.label}</p>
                <p className="text-[10px] text-text-muted leading-tight">{badge.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
