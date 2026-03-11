"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { BOOKING_URL } from "@/lib/constants";

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
    href: BOOKING_URL,
    external: true,
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
    href: BOOKING_URL,
    external: true,
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
    href: "/contact",
    external: false,
    popular: false,
  },
];

export default function PricingTable() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={`p-8 relative bg-background ${
                plan.popular ? "bg-foreground text-background" : ""
              }`}
            >
              {plan.popular && (
                <span className="absolute top-4 right-4 bg-accent text-foreground text-[10px] font-medium uppercase tracking-[0.15em] px-3 py-1">
                  Most Popular
                </span>
              )}
              <p className={`label mb-4 ${
                plan.popular ? "text-accent" : "text-text-muted"
              }`}>
                {plan.name}
              </p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className={`text-4xl font-extralight ${
                  plan.popular ? "text-background" : "text-foreground"
                }`}>
                  {plan.price}
                </span>
                <span className={`text-sm ${
                  plan.popular ? "text-background/50" : "text-text-muted"
                }`}>
                  {plan.per}
                </span>
              </div>
              <p className={`text-sm mb-6 ${
                plan.popular ? "text-background/60" : "text-text-secondary"
              }`}>
                {plan.description}
              </p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className={`flex items-start gap-2.5 text-sm ${
                    plan.popular ? "text-background/80" : "text-text-secondary"
                  }`}>
                    <span className={`mt-0.5 flex-shrink-0 ${plan.popular ? "text-accent" : "text-accent"}`}>&#10003;</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                href={plan.href}
                external={plan.external}
                variant={plan.popular ? "primary" : "outline"}
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
