"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HOMEPAGE_SERVICES } from "@/lib/constants";
import SectionHeader from "@/components/ui/SectionHeader";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function ServicesGrid() {
  return (
    <section className="py-24 px-6">
      <div className="container-site">
        <SectionHeader
          label="Services"
          title="Comprehensive Financial Services"
          subtitle="Tailored to your family's unique needs and goals."
        />
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border"
        >
          {HOMEPAGE_SERVICES.map((service) => (
            <motion.div key={service.title} variants={item}>
              <Link
                href={service.href}
                className="block bg-background p-8 md:p-10 no-underline group hover:bg-muted transition-colors"
              >
                <h3 className="text-xl font-extralight text-foreground mb-3 group-hover:text-accent transition-colors">
                  {service.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-4">
                  {service.description}
                </p>
                <span className="text-foreground text-sm font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  Learn more <span>&rarr;</span>
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
