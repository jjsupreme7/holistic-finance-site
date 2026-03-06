"use client";

import { motion } from "framer-motion";

const logos = [
  { name: "Transamerica", sub: "Partner Agent" },
  { name: "CPMA", sub: "Certified Auditor" },
  { name: "HIPAA", sub: "Compliant" },
  { name: "11+ Years", sub: "Experience" },
];

export default function TrustLogos() {
  return (
    <section className="py-8 bg-dark-card border-y border-white/5">
      <div className="container-site">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-8 md:gap-14"
        >
          <span className="text-xs text-white/50 uppercase tracking-widest font-medium">
            Trusted by families since 2014
          </span>
          <div className="hidden md:block w-px h-6 bg-white/10" />
          {logos.map((logo) => (
            <div key={logo.name} className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-wide">
                {logo.name}
              </span>
              <span className="text-xs text-white/40">{logo.sub}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
