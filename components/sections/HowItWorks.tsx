"use client";

import { motion } from "framer-motion";
import { CalendarCheck, ClipboardList, TrendingUp } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

const steps = [
  {
    step: "01",
    icon: CalendarCheck,
    title: "Book",
    description:
      "Schedule your first consultation for just $59. Meet in person at our University Place office or via Zoom.",
  },
  {
    step: "02",
    icon: ClipboardList,
    title: "Plan",
    description:
      "We review your full financial picture and build a personalized roadmap covering retirement, insurance, and family goals.",
  },
  {
    step: "03",
    icon: TrendingUp,
    title: "Grow",
    description:
      "Follow your plan with ongoing support. Watch your financial confidence and security grow over time.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function HowItWorks() {
  return (
    <section className="py-24 px-6 mesh-gradient-dark-alt relative overflow-hidden">
      <div className="container-site">
        <SectionHeader
          title="How It Works"
          subtitle="Getting started is simple. Three steps to a stronger financial future."
        />
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto"
        >
          {steps.map((s, i) => {
            const IconComponent = s.icon;
            return (
              <motion.div key={s.title} variants={item} className="text-center relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] border-t-2 border-dashed border-primary/30" />
                )}
                <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary-light relative">
                  <IconComponent size={32} strokeWidth={1.5} />
                  <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-gold text-dark text-xs font-bold flex items-center justify-center">
                    {s.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
                <p className="text-text-on-dark-muted text-sm leading-relaxed max-w-xs mx-auto">
                  {s.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
