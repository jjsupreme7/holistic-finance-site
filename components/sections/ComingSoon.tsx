"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import Icon from "@/components/ui/Icon";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const cards = [
  {
    icon: "courses" as const,
    title: "Courses & Classes",
    description: "Free and paid financial education courses to help you and your family build lasting wealth and financial literacy.",
    href: "/courses",
    badge: "Now Enrolling",
    badgeColor: "bg-success-bg text-success",
  },
  {
    icon: "shop" as const,
    title: "Shop",
    description: "Holistic Health & Financial Services merchandise including t-shirts, mugs, and wellness products to support your journey.",
    href: "/shop",
    badge: "Coming Soon",
    badgeColor: "bg-gradient-to-r from-gold to-gold-dark text-dark",
  },
];

export default function ComingSoon() {
  return (
    <section className="py-24 px-6 bg-dark-card relative overflow-hidden">
      <div className="float-blob w-56 h-56 bg-primary/8 bottom-0 left-10" />
      <div className="container-site">
        <SectionHeader
          title="New Offerings"
          subtitle="Explore our latest additions to help you on your financial journey."
        />
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto"
        >
          {cards.map((c) => (
            <Link key={c.title} href={c.href} className="no-underline block group">
              <motion.div
                variants={item}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="glass-dark gradient-border rounded-3xl p-9 text-center relative overflow-hidden hover:glow-sm transition-all"
              >
                <span className={`absolute top-4 right-4 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${c.badgeColor}`}>
                  {c.badge}
                </span>
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                  <Icon name={c.icon} size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{c.title}</h3>
                <p className="text-text-on-dark-muted leading-relaxed mb-4">{c.description}</p>
                <span className="text-gold font-bold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Explore <span>&rarr;</span>
                </span>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
