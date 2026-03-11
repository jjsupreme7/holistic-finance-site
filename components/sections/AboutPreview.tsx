"use client";

import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/motion/FadeIn";
import { IMAGES, SITE_NAME } from "@/lib/constants";

export default function AboutPreview() {
  return (
    <section className="py-24 px-6 bg-muted">
      <div className="container-site grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <FadeIn direction="left" className="lg:col-span-7">
          <div className="overflow-hidden">
            <Image
              src={IMAGES.annaPhoto}
              alt="Anna Huang"
              width={700}
              height={500}
              className="w-full h-auto object-cover"
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
            {SITE_NAME} provides individuals and families with the knowledge and
            tools necessary to invest in their financial future.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            {["11+ Years Experience", "M.S. Professional Accounting", "CPA Candidate", "Tax Preparer"].map((item) => (
              <span
                key={item}
                className="text-xs text-text-secondary border border-border px-3 py-2"
              >
                {item}
              </span>
            ))}
          </div>
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
