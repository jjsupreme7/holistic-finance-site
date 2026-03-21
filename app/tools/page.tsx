"use client";

import PageHero from "@/components/ui/PageHero";
import SectionHeader from "@/components/ui/SectionHeader";
import FadeIn from "@/components/motion/FadeIn";
import Button from "@/components/ui/Button";
import CTABanner from "@/components/sections/CTABanner";
import { IMAGES } from "@/lib/constants";
import Link from "next/link";

const calculators = [
  {
    title: "Retirement Savings Calculator",
    description:
      "Find out how much you could have saved by retirement based on your current savings, contributions, and timeline.",
    href: "/tools/retirement-calculator",
    icon: "📈",
  },
  {
    title: "Mortgage Affordability Calculator",
    description:
      "See how much home you can afford based on your income, debts, and down payment.",
    href: "/tools/mortgage-calculator",
    icon: "🏠",
  },
  {
    title: "Life Insurance Needs Calculator",
    description:
      "Estimate how much life insurance coverage your family needs to stay financially secure.",
    href: "/tools/life-insurance-calculator",
    icon: "🛡️",
  },
  {
    title: "College Savings Calculator",
    description:
      "Plan how much to save each month so your child's education is fully funded.",
    href: "/tools/college-savings-calculator",
    icon: "🎓",
  },
];

export default function ToolsPage() {
  return (
    <>
      <PageHero
        title="Financial Calculators"
        tagline="Free tools to help you plan, prepare, and take the next step"
        backgroundImage={IMAGES.heroServices}
      />

      <section className="py-20 px-6">
        <div className="container-site">
          <SectionHeader
            label="Tools"
            title="Explore Our Calculators"
            subtitle="Get a clearer picture of your finances in minutes. Each calculator is designed to give you a starting point — personalized advice comes next."
            align="center"
          />

          <div className="grid md:grid-cols-2 gap-8 max-w-[1000px] mx-auto">
            {calculators.map((calc, i) => (
              <FadeIn key={calc.href} delay={i * 0.08}>
                <Link
                  href={calc.href}
                  className="group block border border-border p-8 hover:border-accent transition-colors duration-300 no-underline"
                >
                  <span className="text-3xl block mb-4">{calc.icon}</span>
                  <h3 className="heading-sm font-light text-foreground mb-3 group-hover:text-accent transition-colors">
                    {calc.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed text-sm mb-4">
                    {calc.description}
                  </p>
                  <span className="text-accent text-sm font-medium uppercase tracking-[0.15em]">
                    Try it →
                  </span>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <CTABanner title="Ready to Take Control of Your Financial Future?" text="Schedule a consultation and let us help you build a personalized plan." buttonText="Book a Consultation" buttonHref="https://calendly.com/holistic-health-finance/consultation" buttonExternal />
    </>
  );
}
