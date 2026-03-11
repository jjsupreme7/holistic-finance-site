"use client";

import { motion } from "framer-motion";
import PageHero from "@/components/ui/PageHero";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/motion/FadeIn";
import Icon from "@/components/ui/Icon";
import PricingTable from "@/components/sections/PricingTable";
import TestimonialsGrid from "@/components/sections/TestimonialsGrid";
import FAQ from "@/components/sections/FAQ";
import CTABanner from "@/components/sections/CTABanner";
import { BOOKING_URL, SERVICES_DETAIL, IMAGES } from "@/lib/constants";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

function titleToId(title: string) {
  return title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Our Services"
        tagline="Comprehensive financial solutions tailored to your family"
        backgroundImage={IMAGES.heroServices}
      />

      <section className="py-16 px-6">
        <FadeIn className="max-w-[800px] mx-auto text-center">
          <div className="border border-border p-10 md:p-14">
            <p className="heading-lg font-extralight text-foreground mb-5">
              Start with a Consultation
            </p>
            <p className="text-text-secondary leading-relaxed mb-8 text-lg">
              Schedule time with Anna to talk through your goals, questions, and the services that
              fit your situation best. Pricing varies by service, and the options below give you a
              clearer picture of what is available.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {["Retirement", "Insurance", "Tax Preparation", "Family Planning"].map((item) => (
                <span
                  key={item}
                  className="text-text-secondary text-sm font-medium border border-border px-5 py-2"
                >
                  {item}
                </span>
              ))}
            </div>
            <Button href={BOOKING_URL} external>Book a Consultation</Button>
            <p className="mt-5 text-sm text-success font-medium">
              You&apos;ll receive confirmation and reminders through Calendly.
            </p>
          </div>
        </FadeIn>
      </section>

      <section className="bg-muted">
        <div className="container-site pt-16">
          <SectionHeader
            label="Pricing"
            title="Choose Your Plan"
            subtitle="Flexible options to fit your needs and budget"
          />
        </div>
        <PricingTable />
      </section>

      <section className="py-20 px-6">
        <div className="container-site">
          <SectionHeader label="All Services" title="What We Offer" />
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border"
          >
            {SERVICES_DETAIL.map((service) => (
              <motion.div
                key={service.title}
                id={titleToId(service.title)}
                variants={item}
                className="bg-background p-6 group hover:bg-muted transition-colors"
              >
                <div className="text-text-muted mb-4">
                  <Icon name={service.icon} size={28} />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-medium text-foreground">{service.title}</h3>
                </div>
                <span className={`text-xs font-medium px-3 py-1 inline-block mb-3 ${
                  service.price === "Free Quote"
                    ? "bg-success/10 text-success"
                    : "bg-accent/10 text-accent-dark"
                }`}>
                  {service.price}
                </span>
                <p className="text-text-secondary text-sm leading-relaxed mb-5">
                  {service.description}
                </p>
                <Button href={BOOKING_URL} external variant="outline" className="text-xs w-full text-center">
                  Get Started
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <TestimonialsGrid />
      <FAQ />

      <CTABanner
        title="Ready to Get Started?"
        text="Schedule a consultation and take the first step toward a clearer financial plan."
        buttonText="Book a Consultation"
        buttonHref={BOOKING_URL}
        buttonExternal
      />
    </>
  );
}
