import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import SectionHeader from "@/components/ui/SectionHeader";
import FadeIn from "@/components/motion/FadeIn";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import CTABanner from "@/components/sections/CTABanner";
import { BOOKING_URL, IMAGES } from "@/lib/constants";
import type { IconName } from "@/lib/icons";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Start Here",
  description:
    "Choose the right next step for financial planning, classes, consultations, and support at Holistic Health & Financial Services.",
  path: "/start-here",
  keywords: [
    "financial planning start here",
    "book consultation",
    "financial classes",
    "financial help University Place",
  ],
});

const START_PATHS: Array<{
  icon: IconName;
  title: string;
  description: string;
  bullets: string[];
  primaryLabel: string;
  primaryHref: string;
  primaryExternal?: boolean;
  secondaryLabel: string;
  secondaryHref: string;
}> = [
  {
    icon: "phone",
    title: "I Need Help Now",
    description:
      "Use this path if you are ready to talk through a personal situation, need help deciding what service fits, or want direct support.",
    bullets: [
      "Consultations for planning, insurance, tax prep, and big money decisions",
      "Best if your situation feels urgent or personal",
      "Ideal for clients who want advice, not just information",
    ],
    primaryLabel: "Book a Consultation",
    primaryHref: BOOKING_URL,
    primaryExternal: true,
    secondaryLabel: "Ask a Question",
    secondaryHref: "/contact",
  },
  {
    icon: "courses",
    title: "I Want To Learn First",
    description:
      "Use this path if you want to build confidence before booking, join classes, or work through financial topics step by step.",
    bullets: [
      "Upcoming free community classes and paid workshops",
      "26-module training series for deeper financial education",
      "Good fit if you prefer education before one-on-one planning",
    ],
    primaryLabel: "Explore Courses",
    primaryHref: "/courses",
    secondaryLabel: "Read The Blog",
    secondaryHref: "/blog",
  },
  {
    icon: "bell",
    title: "I Want Updates & Resources",
    description:
      "Use this path if you are not ready to book yet but want announcements, reminders, and practical financial guidance in your inbox.",
    bullets: [
      "Class and event announcements",
      "New blog posts and practical tips",
      "Best if you want to stay connected without committing yet",
    ],
    primaryLabel: "Get Email Updates",
    primaryHref: "/newsletter",
    secondaryLabel: "View Events",
    secondaryHref: "/events",
  },
];

const COMMON_REASONS: Array<{ icon: IconName; text: string }> = [
  { icon: "licensed", text: "I need help preparing for taxes or getting my paperwork organized." },
  { icon: "retirement", text: "I want to understand retirement, insurance, or budgeting without feeling overwhelmed." },
  { icon: "mortgage", text: "I am a first-time homebuyer and want guidance before making a big move." },
  { icon: "education", text: "I want classes, community education, and future learning resources for my family." },
];

const WHAT_HAPPENS_NEXT = [
  {
    step: "1",
    title: "Choose Your Path",
    text: "Start with direct support, self-paced learning, or updates depending on how ready you feel today.",
  },
  {
    step: "2",
    title: "Take One Clear Action",
    text: "Book, ask a question, register for a class, or subscribe. The goal is one useful next step, not more overwhelm.",
  },
  {
    step: "3",
    title: "Get Guidance That Fits",
    text: "Anna can meet you where you are, whether you need planning help, financial education, or a simple starting point.",
  },
];

export default function StartHerePage() {
  return (
    <>
      <PageHero
        title="Start Here"
        tagline="Choose the best next step for your finances, your questions, and your family."
        backgroundImage={IMAGES.heroServices}
      />

      <section className="py-16 px-6">
        <FadeIn className="container-site">
          <div className="max-w-3xl border border-border p-8 md:p-12 bg-background">
            <span className="label text-accent block mb-4">A Simpler Way In</span>
            <h2 className="heading-lg font-extralight text-foreground mb-4">
              If You&apos;re Not Sure Where To Begin, Start With The Path That Feels Closest.
            </h2>
            <p className="text-lg text-text-secondary leading-relaxed">
              Some visitors are ready to book immediately. Others want to learn first, ask a few
              questions, or keep up with new classes and resources. This page is here to make that
              first step obvious.
            </p>
          </div>
        </FadeIn>
      </section>

      <section className="py-20 px-6 bg-muted">
        <div className="container-site">
          <SectionHeader
            label="Pick Your Path"
            title="Three Good Ways To Begin"
            subtitle="You do not need to have everything figured out before taking the next step."
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-border">
            {START_PATHS.map((path, index) => (
              <FadeIn key={path.title}>
                <div className={`h-full p-8 md:p-10 ${index === 1 ? "bg-background" : "bg-muted"}`}>
                  <div className="w-14 h-14 bg-background flex items-center justify-center text-text-muted mb-6">
                    <Icon name={path.icon} size={26} />
                  </div>
                  <h3 className="text-3xl font-extralight text-foreground mb-4">{path.title}</h3>
                  <p className="text-text-secondary leading-relaxed mb-6">{path.description}</p>
                  <div className="space-y-3 mb-8">
                    {path.bullets.map((bullet) => (
                      <div key={bullet} className="flex items-start gap-3">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                        <p className="text-sm text-text-secondary leading-relaxed">{bullet}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      href={path.primaryHref}
                      external={path.primaryExternal}
                      className="text-xs px-6 py-3"
                    >
                      {path.primaryLabel}
                    </Button>
                    <Button
                      href={path.secondaryHref}
                      variant="outline"
                      className="text-xs px-6 py-3"
                    >
                      {path.secondaryLabel}
                    </Button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="container-site grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
          <FadeIn>
            <div className="border border-border p-8 md:p-10 bg-background">
              <span className="label text-success block mb-4">Common Reasons People Come Here</span>
              <div className="space-y-4">
                {COMMON_REASONS.map((reason) => (
                  <div key={reason.text} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-muted flex items-center justify-center text-text-muted flex-shrink-0">
                      <Icon name={reason.icon} size={18} />
                    </div>
                    <p className="text-text-secondary leading-relaxed">{reason.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn>
            <div className="border border-border p-8 md:p-10 bg-muted">
              <span className="label text-text-muted block mb-4">What Happens Next</span>
              <div className="space-y-6">
                {WHAT_HAPPENS_NEXT.map((item) => (
                  <div key={item.step} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-foreground text-background text-sm font-medium flex items-center justify-center flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-xl font-extralight text-foreground mb-2">{item.title}</h3>
                      <p className="text-text-secondary leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-20 px-6 bg-muted">
        <FadeIn className="container-site">
          <div className="border border-border bg-background p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-2xl">
              <span className="label text-accent block mb-3">Need A Recommendation?</span>
              <h2 className="text-3xl md:text-4xl font-extralight text-foreground mb-3">
                You Don&apos;t Need To Choose Perfectly.
              </h2>
              <p className="text-text-secondary leading-relaxed">
                If you are deciding between services, classes, or a future learning path, start
                with a question. We can point you in the right direction.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="/contact" className="text-xs px-6 py-3">
                Ask A Question
              </Button>
              <Button href="/services" variant="outline" className="text-xs px-6 py-3">
                View Services
              </Button>
            </div>
          </div>
        </FadeIn>
      </section>

      <CTABanner
        title="Ready For A Clear Next Step?"
        text="Start with a consultation if you want personal guidance, or use the path above that fits where you are right now."
        buttonText="Book a Consultation"
        buttonHref={BOOKING_URL}
        buttonExternal
      />
    </>
  );
}
