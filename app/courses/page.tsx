"use client";

import { motion } from "framer-motion";
import PageHero from "@/components/ui/PageHero";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/motion/FadeIn";
import Icon from "@/components/ui/Icon";
import CTABanner from "@/components/sections/CTABanner";
import { COURSES, IMAGES } from "@/lib/constants";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function CoursesPage() {
  const freeCourses = COURSES.filter((c) => c.type === "free");
  const paidCourses = COURSES.filter((c) => c.type === "paid");

  return (
    <>
      <PageHero
        title="Courses & Classes"
        tagline="Financial education for you and your family"
        backgroundImage={IMAGES.heroCourses}
      />

      <section className="py-16 px-6">
        <FadeIn className="max-w-[800px] mx-auto text-center">
          <div className="border border-border p-10 md:p-14">
            <span className="inline-block label text-success mb-5">
              Now Enrolling
            </span>
            <h2 className="heading-lg font-extralight text-foreground mb-4">
              Invest in Your Financial Education
            </h2>
            <p className="text-text-secondary leading-relaxed text-lg mb-6">
              Whether you&apos;re just starting out or looking to level up, our courses are
              designed to give you the knowledge and confidence to make smarter financial decisions
              for your family.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <span className="text-success text-sm font-medium border border-success/20 px-5 py-2">
                Free classes available
              </span>
              <span className="text-text-secondary text-sm font-medium border border-border px-5 py-2">
                Zoom & In-Person
              </span>
            </div>
          </div>
        </FadeIn>
      </section>

      <section className="py-16 px-6 bg-muted">
        <div className="container-site">
          <SectionHeader
            label="Free"
            title="Free Classes"
            subtitle="Start your financial journey with no cost. Open to everyone."
          />
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border"
          >
            {freeCourses.map((course) => (
              <motion.div
                key={course.title}
                variants={item}
                className="bg-muted p-8 hover:bg-background transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-background flex items-center justify-center text-text-muted">
                    <Icon name={course.icon} size={24} />
                  </div>
                  <span className="label text-success">
                    Free
                  </span>
                </div>
                <h3 className="text-xl font-extralight text-foreground mb-2">{course.title}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs text-text-muted border border-border px-3 py-1">{course.duration}</span>
                  <span className="text-xs text-text-muted border border-border px-3 py-1">{course.format}</span>
                  <span className="text-xs text-foreground font-medium border border-border px-3 py-1">{course.date}</span>
                </div>
                <p className="text-text-secondary leading-relaxed mb-6">{course.description}</p>
                <Button href="/contact" className="text-sm">
                  Register Free
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="container-site">
          <SectionHeader
            label="Premium"
            title="Premium Courses"
            subtitle="Deep-dive courses for serious financial growth."
          />
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border"
          >
            {paidCourses.map((course) => (
              <motion.div
                key={course.title}
                variants={item}
                className="bg-background p-8 hover:bg-muted transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-muted flex items-center justify-center text-text-muted">
                    <Icon name={course.icon} size={24} />
                  </div>
                  <span className="bg-accent text-foreground text-sm font-medium px-4 py-1">
                    {course.price}
                  </span>
                </div>
                <h3 className="text-xl font-extralight text-foreground mb-2">{course.title}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs text-text-muted border border-border px-3 py-1">{course.duration}</span>
                  <span className="text-xs text-text-muted border border-border px-3 py-1">{course.format}</span>
                  <span className="text-xs text-foreground font-medium border border-border px-3 py-1">{course.date}</span>
                </div>
                <p className="text-text-secondary leading-relaxed mb-6">{course.description}</p>
                <Button href="/contact" className="text-sm">
                  Enroll Now
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <CTABanner
        title="Not Sure Which Course Is Right for You?"
        text="Book a free 15-minute call and we'll help you find the best starting point for your financial journey."
        buttonText="Book a Consultation"
      />
    </>
  );
}
