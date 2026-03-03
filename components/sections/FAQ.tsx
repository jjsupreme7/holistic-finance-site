"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";

const faqs = [
  {
    q: "What happens during a first consultation?",
    a: "During your first session, we'll review your current financial situation, discuss your goals, and identify areas where we can help. It's a no-pressure conversation designed to understand your family's unique needs.",
  },
  {
    q: "Do you offer virtual appointments?",
    a: "Yes! We offer both in-person appointments at our University Place office and virtual sessions via Zoom. Whatever works best for your schedule.",
  },
  {
    q: "How much does a session cost?",
    a: "Your first consultation starts at $59. Regular sessions range from $79\u2013$99 depending on the service. Life insurance and health insurance quotes are always free.",
  },
  {
    q: "What services do you specialize in?",
    a: "We specialize in retirement planning, education planning, mortgage planning, family financial planning, insurance (health & life), and estate planning. We take a holistic approach that considers your entire financial picture.",
  },
  {
    q: "Do I need to prepare anything before my appointment?",
    a: "It helps to have a general idea of your income, expenses, and financial goals. If you have existing insurance policies or retirement account statements, bring those along. But don't worry \u2014 we'll guide you through everything.",
  },
  {
    q: "Can you help with health insurance enrollment?",
    a: "Absolutely. As a licensed health and life insurance agent, Anna can help you navigate marketplace plans, employer benefits, and find the right coverage for your family at no cost for the quote.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 px-6 relative overflow-hidden">
      <div className="float-blob w-64 h-64 bg-primary/6 top-20 -right-20" />
      <div className="max-w-[800px] mx-auto relative z-10">
        <SectionHeader
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about our services"
        />
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="card-soft rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
                aria-controls={`faq-answer-${i}`}
                className="w-full flex items-center justify-between p-6 text-left bg-transparent border-none cursor-pointer group"
              >
                <span className="text-dark font-bold text-[15px] pr-4 group-hover:text-primary transition-colors">
                  {faq.q}
                </span>
                <motion.span
                  animate={{ rotate: openIndex === i ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-xl text-primary flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"
                  aria-hidden="true"
                >
                  +
                </motion.span>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    id={`faq-answer-${i}`}
                    role="region"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-text-light leading-relaxed text-[15px]">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
