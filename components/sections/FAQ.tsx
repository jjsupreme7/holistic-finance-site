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
    a: "Pricing depends on the service you need. Initial consultations may start at $59, regular planning sessions generally range from $79\u2013$99, and life or health insurance quotes are always free.",
  },
  {
    q: "What services do you specialize in?",
    a: "We specialize in retirement planning, education planning, mortgage planning, tax preparation and planning, family financial planning, insurance (health & life), and estate planning. We take a holistic approach that considers your entire financial picture.",
  },
  {
    q: "Do I need to prepare anything before my appointment?",
    a: "It helps to have a general idea of your income, expenses, and financial goals. If you have existing insurance policies or retirement account statements, bring those along. But don't worry \u2014 we'll guide you through everything.",
  },
  {
    q: "Can you help with health insurance enrollment?",
    a: "Absolutely. As a licensed health and life insurance agent, Anna can help you navigate marketplace plans, employer benefits, and find the right coverage for your family at no cost for the quote.",
  },
  {
    q: "Do you offer tax preparation support?",
    a: "Yes. Tax preparation and tax-aware planning are part of the service mix, especially for individuals and families who want better year-round organization and clearer filing support.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 px-6 bg-muted">
      <div className="max-w-[800px] mx-auto">
        <SectionHeader
          label="FAQ"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about our services"
        />
        <div>
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="border-b border-border"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
                aria-controls={`faq-answer-${i}`}
                className="w-full flex items-center justify-between py-6 text-left bg-transparent border-none cursor-pointer group"
              >
                <span className="text-foreground font-medium text-[15px] pr-4 group-hover:text-accent transition-colors">
                  {faq.q}
                </span>
                <span
                  className="text-lg text-text-muted flex-shrink-0 w-8 h-8 flex items-center justify-center transition-transform"
                  style={{ transform: openIndex === i ? "rotate(45deg)" : "rotate(0deg)" }}
                  aria-hidden="true"
                >
                  +
                </span>
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
                    <p className="pb-6 text-text-secondary leading-relaxed text-[15px]">
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
