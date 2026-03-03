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
import { SERVICES_DETAIL } from "@/lib/constants";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
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
      />

      <section className="py-16 px-6 relative overflow-hidden">
        <div className="float-blob w-80 h-80 bg-gold/8 -top-20 -right-20" />
        <FadeIn className="max-w-[800px] mx-auto text-center relative z-10">
          <div className="glass rounded-3xl p-10 md:p-14 gradient-border glow-md">
            <p className="text-[2.5rem] font-bold text-gradient mb-5">
              First Consultation Starts At $59
            </p>
            <p className="text-text-light leading-relaxed mb-8 text-lg">
              Unlock your financial potential with personalized planning services designed to fit
              your unique needs. Whether you&apos;re planning for retirement, saving for your
              child&apos;s education, or seeking to grow your wealth, we are here to guide you every
              step of the way.
            </p>
            <Button href="/contact">Book Your Consultation &mdash; $59</Button>
            <p className="mt-5 text-sm bg-success-bg text-success inline-block px-5 py-2 rounded-full font-medium">
              You&apos;ll receive a confirmation within 24 hours of booking.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* Pricing Comparison */}
      <section className="mesh-gradient relative overflow-hidden">
        <div className="container-site pt-16">
          <SectionHeader
            title="Choose Your Plan"
            subtitle="Flexible options to fit your needs and budget"
          />
        </div>
        <PricingTable />
      </section>

      <section className="py-20 px-6 relative overflow-hidden">
        <div className="float-blob w-64 h-64 bg-primary/8 bottom-20 -left-10" />
        <div className="container-site">
          <SectionHeader title="All Services" />
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {SERVICES_DETAIL.map((service) => (
              <motion.div
                key={service.title}
                id={titleToId(service.title)}
                variants={item}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="glass rounded-2xl overflow-hidden gradient-border glow-sm hover:glow-md transition-all duration-300"
              >
                <div className="bg-gradient-to-br from-primary/10 to-primary/3 text-center py-6 text-primary">
                  <Icon name={service.icon} size={36} className="mx-auto" />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-gradient">{service.title}</h3>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      service.price === "Free Quote"
                        ? "bg-success-bg text-success"
                        : "bg-gold/15 text-gold-dark"
                    }`}>
                      {service.price}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-zoom" />
                    <span className="text-zoom text-xs font-medium">
                      Zoom or in-person
                    </span>
                  </div>
                  <p className="text-text-light text-sm leading-relaxed mb-5">
                    {service.description}
                  </p>
                  <Button href="/contact" variant="outline" className="text-sm w-full text-center">
                    Get Started
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <TestimonialsGrid />
      <FAQ />

      <CTABanner
        title="Ready to Get Started?"
        text="Book your first consultation for just $59 and take the first step toward financial freedom."
        buttonText="Book a Consultation"
      />
    </>
  );
}
