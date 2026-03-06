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
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
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

      <section className="py-16 px-6 relative overflow-hidden">
        <div className="float-blob w-80 h-80 bg-gold/8 -top-20 -right-20" />
        <FadeIn className="max-w-[800px] mx-auto text-center relative z-10">
          <div className="glass rounded-3xl p-10 md:p-14 gradient-border glow-sm">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-success bg-success-bg px-4 py-1.5 rounded-full mb-5">
              Now Enrolling
            </span>
            <h2 className="text-[2rem] font-bold text-dark mb-4">
              Invest in Your <span className="text-gradient">Financial Education</span>
            </h2>
            <p className="text-text-light leading-relaxed text-lg mb-6">
              Whether you&apos;re just starting out or looking to level up, our courses are
              designed to give you the knowledge and confidence to make smarter financial decisions
              for your family.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <span className="bg-success-bg text-success text-sm font-medium px-5 py-2 rounded-full border border-success/20">
                Free classes available
              </span>
              <span className="bg-zoom/10 text-zoom text-sm font-medium px-5 py-2 rounded-full border border-zoom/20">
                Zoom & In-Person
              </span>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Free Courses */}
      <section className="py-16 px-6 mesh-gradient-dark relative overflow-hidden">
        <div className="float-blob w-64 h-64 bg-primary/8 bottom-10 -left-10" />
        <div className="container-site">
          <SectionHeader
            title="Free Classes"
            subtitle="Start your financial journey with no cost. Open to everyone."
          />
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {freeCourses.map((course) => (
              <motion.div
                key={course.title}
                variants={item}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
                className="glass-dark rounded-2xl p-8 gradient-border glow-sm hover:glow-md transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-success/20 to-success/8 flex items-center justify-center text-success">
                    <Icon name={course.icon} size={24} />
                  </div>
                  <span className="bg-success/15 text-success text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                    Free
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs text-white/50 bg-white/8 px-3 py-1 rounded-full">{course.duration}</span>
                  <span className="text-xs text-white/50 bg-white/8 px-3 py-1 rounded-full">{course.format}</span>
                  <span className="text-xs text-primary-light bg-primary/15 px-3 py-1 rounded-full font-medium">{course.date}</span>
                </div>
                <p className="text-white/60 leading-relaxed mb-6">{course.description}</p>
                <Button href="/contact" variant="primary" className="text-sm">
                  Register Free
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Paid Courses */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="float-blob w-72 h-72 bg-gold/8 top-10 right-10" />
        <div className="container-site">
          <SectionHeader
            title="Premium Courses"
            subtitle="Deep-dive courses for serious financial growth."
          />
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {paidCourses.map((course) => (
              <motion.div
                key={course.title}
                variants={item}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
                className="glass-dark rounded-2xl p-8 gradient-border glow-sm hover:glow-md transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/8 flex items-center justify-center text-gold">
                    <Icon name={course.icon} size={24} />
                  </div>
                  <span className="bg-gradient-to-r from-gold to-gold-dark text-dark text-sm font-bold px-4 py-1.5 rounded-full">
                    {course.price}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs text-white/50 bg-white/8 px-3 py-1 rounded-full">{course.duration}</span>
                  <span className="text-xs text-white/50 bg-white/8 px-3 py-1 rounded-full">{course.format}</span>
                  <span className="text-xs text-primary-light bg-primary/15 px-3 py-1 rounded-full font-medium">{course.date}</span>
                </div>
                <p className="text-white/60 leading-relaxed mb-6">{course.description}</p>
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
