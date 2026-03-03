"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { IMAGES } from "@/lib/constants";

interface PageHeroProps {
  title: string;
  tagline: string;
}

function Breadcrumbs() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  const pageName = pathname
    .split("/")
    .filter(Boolean)
    .pop()
    ?.replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-xs text-white/50">
        <li>
          <a href="/" className="hover:text-gold transition-colors no-underline text-white/50">Home</a>
        </li>
        <li aria-hidden="true">/</li>
        <li className="text-gold/80 font-medium">{pageName}</li>
      </ol>
    </nav>
  );
}

export default function PageHero({ title, tagline }: PageHeroProps) {
  return (
    <section
      className="relative pt-32 pb-20 text-center text-white bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${IMAGES.hero})` }}
    >
      <div className="absolute inset-0 animated-gradient-overlay" />
      {/* Decorative orbs */}
      <div className="float-blob w-96 h-96 bg-primary/30 -top-32 -right-32" />
      <div className="float-blob w-64 h-64 bg-gold/15 bottom-0 left-10" />

      <div className="container-site">
        <Breadcrumbs />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-block mb-6"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold/80 bg-gold/10 border border-gold/20 px-4 py-1.5 rounded-full">
            Holistic Health and Finance
          </span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[2.75rem] md:text-[3.25rem] font-bold text-white mb-4"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-xl text-white/70 max-w-xl mx-auto"
        >
          {tagline}
        </motion.p>
      </div>
    </section>
  );
}
