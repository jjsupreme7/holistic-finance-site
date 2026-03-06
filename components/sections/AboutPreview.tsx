"use client";

import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/motion/FadeIn";
import { IMAGES } from "@/lib/constants";

export default function AboutPreview() {
  return (
    <section className="py-24 px-6 bg-muted">
      <div className="container-site grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <FadeIn direction="left" className="lg:col-span-7">
          <div className="overflow-hidden">
            <Image
              src={IMAGES.aboutPreview}
              alt="Financial planning consultation"
              width={700}
              height={500}
              className="w-full h-auto img-grayscale object-cover"
            />
          </div>
        </FadeIn>
        <FadeIn direction="right" className="lg:col-span-4 lg:col-start-9">
          <span className="label text-text-muted block mb-5">About Us</span>
          <p className="text-2xl font-extralight text-foreground leading-snug mb-6">
            &ldquo;We make the complex world of finance easier to navigate, empowering you to live
            a fulfilling life with a personalized financial plan.&rdquo;
          </p>
          <p className="text-text-secondary leading-relaxed mb-8">
            Holistic Health and Finance provides individuals and families with the knowledge and
            tools necessary to invest in their financial future.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-foreground font-medium no-underline group text-sm uppercase tracking-[0.15em]"
          >
            Meet Anna Huang
            <span className="inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
