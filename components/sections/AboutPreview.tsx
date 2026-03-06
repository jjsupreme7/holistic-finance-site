"use client";

import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/motion/FadeIn";
import { IMAGES } from "@/lib/constants";

export default function AboutPreview() {
  return (
    <section className="py-24 px-6 bg-dark-surface relative overflow-hidden">
      <div className="float-blob w-80 h-80 bg-gold/8 -bottom-20 -right-20" />
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 items-center relative z-10">
        <FadeIn direction="left">
          <div className="relative glass-dark rounded-2xl gradient-border glow-md p-2">
            <Image
              src={IMAGES.aboutPreview}
              alt="Financial planning consultation"
              width={540}
              height={408}
              className="rounded-xl w-full h-auto"
            />
          </div>
        </FadeIn>
        <FadeIn direction="right">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold bg-gold/10 border border-gold/20 px-4 py-1.5 rounded-full inline-block mb-5">
            About Us
          </span>
          <h2 className="text-[2.5rem] font-bold text-white mb-5 leading-tight">
            Finance Made <span className="text-gradient-gold">Easy</span>
          </h2>
          <p className="text-text-on-dark-muted leading-relaxed mb-8 text-lg">
            Holistic Health and Finance provides individuals and families with the knowledge and
            tools necessary to invest in their financial future. We make the complex world of
            finance easier to navigate, empowering you to live a fulfilling life with a
            personalized financial plan.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-gold font-bold no-underline group text-lg"
          >
            Meet Anna Huang
            <span className="inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
