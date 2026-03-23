"use client";

import { motion } from "framer-motion";
import PageHero from "@/components/ui/PageHero";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/motion/FadeIn";
import Icon from "@/components/ui/Icon";
import CTABanner from "@/components/sections/CTABanner";
import { IMAGES } from "@/lib/constants";
import type { CourseScheduleItem } from "@/lib/schedule";
import type { TrainingSeriesGroup } from "@/lib/training-series";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

function titleToId(title: string) {
  return title.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function buildCourseInquiryHref(
  course: CourseScheduleItem,
  intent: "register" | "enroll"
) {
  const params = new URLSearchParams({
    service: "Courses & Classes",
    course: course.title,
    message:
      intent === "register"
        ? `Hi, I'd like to register for "${course.title}" on ${course.date}. Please send me the next steps.`
        : `Hi, I'm interested in enrolling in "${course.title}" on ${course.date}. Please send me the next steps.`,
  });

  return `/contact?${params.toString()}#question-form`;
}

export default function CoursesPageContent({
  courses,
  trainingSeriesGroups,
}: {
  courses: CourseScheduleItem[];
  trainingSeriesGroups: TrainingSeriesGroup[];
}) {
  const freeCourses = courses.filter((course) => course.type === "free");
  const paidCourses = courses.filter((course) => course.type === "paid");
  const trainingSeriesCount = trainingSeriesGroups.reduce(
    (total, group) => total + group.modules.length,
    0
  );

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
              Whether you&apos;re just starting out or looking to level up, our classes and
              training modules are designed to give you the knowledge and confidence to make
              smarter financial decisions for your family, your future, and your business.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <span className="text-success text-sm font-medium border border-success/20 px-5 py-2">
                {trainingSeriesCount} knowledge modules available
              </span>
              <span className="text-text-secondary text-sm font-medium border border-border px-5 py-2">
                Zoom & In-Person
              </span>
              <span className="text-text-secondary text-sm font-medium border border-border px-5 py-2">
                Private groups & family sessions
              </span>
            </div>
          </div>
        </FadeIn>
      </section>

      <section className="py-20 px-6 bg-muted">
        <div className="container-site">
          <SectionHeader
            label="Knowledge Series"
            title="26 Core Training Modules"
            subtitle="The full training series Anna requested is now structured on-site as real course content instead of a screenshot."
          />

          <FadeIn className="mb-8">
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              {trainingSeriesGroups.map((group) => (
                <a
                  key={group.title}
                  href={`#${titleToId(group.title)}`}
                  className="text-sm font-medium border border-border px-4 py-2 no-underline text-foreground hover:bg-background transition-colors"
                >
                  {group.eyebrow}
                </a>
              ))}
            </div>
          </FadeIn>

          <div className="space-y-10">
            {trainingSeriesGroups.map((group) => (
              <FadeIn key={group.title}>
                <div id={titleToId(group.title)} className="border border-border bg-background scroll-mt-28">
                  <div className="p-8 md:p-10 border-b border-border flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    <div className="max-w-3xl">
                      <span className="label text-accent block mb-3">{group.eyebrow}</span>
                      <h3 className="text-3xl font-extralight text-foreground mb-3">{group.title}</h3>
                      <p className="text-text-secondary leading-relaxed">{group.description}</p>
                    </div>
                    <div className="w-14 h-14 bg-muted flex items-center justify-center text-text-muted flex-shrink-0">
                      <Icon name={group.accent} size={26} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px bg-border">
                    {group.modules.map((module) => (
                      <div key={module.number} className="bg-background p-6 md:p-7">
                        <div className="w-11 h-11 bg-foreground text-background text-sm font-medium flex items-center justify-center mb-5">
                          {module.number}
                        </div>
                        <h4 className="text-xl font-extralight text-foreground mb-3 leading-snug">
                          {module.title}
                        </h4>
                        <p className="text-text-secondary leading-relaxed text-sm">{module.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-muted">
        <div className="container-site">
          <SectionHeader
            label="Upcoming"
            title="Free Community Classes"
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
                key={course.id}
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
                <Button href={buildCourseInquiryHref(course, "register")} className="text-sm">
                  Request Free Spot
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="container-site">
          <SectionHeader
            label="Workshops"
            title="Featured Paid Courses"
            subtitle="Deep-dive workshops for households ready to move from theory into action."
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
                key={course.id}
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
                <Button href={buildCourseInquiryHref(course, "enroll")} className="text-sm">
                  Ask About Enrollment
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <CTABanner
        title="Need Help Choosing the Right Course Path?"
        text="Reach out for course recommendations, private group sessions, or questions about the knowledge training series."
        buttonText="Request Course Information"
      />
    </>
  );
}
