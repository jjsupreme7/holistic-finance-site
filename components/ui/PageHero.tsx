"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { IMAGES, SITE_NAME } from "@/lib/constants";

interface PageHeroProps {
  title: string;
  tagline: string;
  backgroundImage?: string;
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
          <Link href="/" className="hover:text-white transition-colors no-underline text-white/50">
            Home
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li className="text-white/80 font-medium">{pageName}</li>
      </ol>
    </nav>
  );
}

export default function PageHero({ title, tagline, backgroundImage }: PageHeroProps) {
  return (
    <section
      className="relative pt-40 pb-20 text-white bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${backgroundImage ?? IMAGES.hero})` }}
      role="img"
      aria-label={`${title} page hero background`}
    >
      <div className="absolute inset-0 bg-foreground/50" />

      <div className="container-site relative z-10">
        <Breadcrumbs />
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="label text-white/60 block mb-4"
        >
          {SITE_NAME}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="heading-lg font-extralight text-white mb-4"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-xl text-white/70 max-w-xl font-light"
        >
          {tagline}
        </motion.p>
      </div>
    </section>
  );
}
