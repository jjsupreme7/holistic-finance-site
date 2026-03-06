"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

const plans = [
  {
    name: "Single Session",
    price: "$79",
    per: "per session",
    description: "Perfect for a one-time consultation on a specific topic",
    features: [
      "60-minute session",
      "Choose any service topic",
      "Zoom or in-person",
      "Personalized action plan",
      "Email follow-up summary",
    ],
    cta: "Book a Session",
    popular: false,
  },
  {
    name: "Comprehensive Plan",
    price: "$199",
    per: "3-session package",
    description: "A deep dive into your full financial picture with ongoing support",
    features: [
      "Three 60-minute sessions",
      "Full financial health review",
      "Retirement + insurance audit",
      "Custom family financial plan",
      "Priority email support (30 days)",
      "Savings of $38 vs. single sessions",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Free Quote",
    price: "$0",
    per: "no obligation",
    description: "Get a personalized quote for life or health insurance",
    features: [
      "Life insurance quote",
      "Health insurance quote",
      "Plan comparison breakdown",
      "No commitment required",
      "Zoom or phone call",
    ],
    cta: "Request a Quote",
    popular: false,
  },
];

export default function PricingTable() {
  return (
    <section className="py-20 px-6 relative overflow-hidden">
      <div className="float-blob w-72 h-72 bg-gold/8 -top-10 right-10" />
      <div className="float-blob w-56 h-56 bg-primary/6 bottom-10 -left-10" />
      <div className="max-w-[1100px] mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className={`rounded-3xl p-8 relative overflow-hidden transition-all ${
                plan.popular
                  ? "glass-dark text-white glow-gold"
                  : "glass-dark glow-sm hover:glow-md"
              }`}
            >
              {plan.popular && (
                <span className="absolute top-4 right-4 bg-gradient-to-r from-gold to-gold-dark text-dark text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <p className={`text-sm font-bold uppercase tracking-wider mb-4 ${
                plan.popular ? "text-gold" : "text-primary-light"
              }`}>
                {plan.name}
              </p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className={`text-4xl font-bold ${
                  plan.popular ? "text-white" : "text-white"
                }`}>
                  {plan.price}
                </span>
                <span className={`text-sm ${
                  plan.popular ? "text-white/50" : "text-white/50"
                }`}>
                  {plan.per}
                </span>
              </div>
              <p className={`text-sm mb-6 ${
                plan.popular ? "text-white/60" : "text-white/60"
              }`}>
                {plan.description}
              </p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className={`flex items-start gap-2.5 text-sm ${
                    plan.popular ? "text-white/80" : "text-white/80"
                  }`}>
                    <span className="text-gold mt-0.5 flex-shrink-0">&#10003;</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                href="/contact"
                variant={plan.popular ? "gold" : "outline"}
                className="w-full text-center text-sm"
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
