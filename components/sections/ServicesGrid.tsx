"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import Icon from "@/components/ui/Icon";
import { HOMEPAGE_SERVICES } from "@/lib/constants";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ServicesGrid() {
  return (
    <section className="py-20 px-6 relative overflow-hidden">
      <div className="float-blob w-72 h-72 bg-gold/8 -top-20 right-10" />
      <div className="container-site">
        <SectionHeader
          title="Services"
          subtitle="Comprehensive financial services tailored to your family's unique needs and goals."
        />
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {HOMEPAGE_SERVICES.map((service) => (
            <motion.div key={service.title} variants={item}>
              <Link
                href={service.href}
                className="block card-solid rounded-2xl overflow-hidden no-underline glow-sm hover:glow-md transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="bg-gradient-to-br from-primary/8 to-primary/3 text-center py-6 text-primary">
                  <Icon name={service.icon} size={36} className="mx-auto" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gradient mb-2">{service.title}</h3>
                  <p className="text-text-light text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <span className="text-primary text-sm font-bold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    Learn more <span>&rarr;</span>
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
