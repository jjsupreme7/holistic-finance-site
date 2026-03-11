import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/ui/PageHero";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/motion/FadeIn";
import CTABanner from "@/components/sections/CTABanner";
import { IMAGES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Anna Huang",
  description:
    "Meet Anna Huang - 11+ years of experience in Healthcare Finance and Insurance. Licensed Health and Life Insurance agent, Tax Preparer, CPA candidate, and Certified Professional Medical Auditor in University Place, WA.",
};

const credentialsList = [
  { top: "11+ Years", bottom: "Experience" },
  { top: "Licensed", bottom: "Health & Life" },
  { top: "CPMA", bottom: "Certified" },
  { top: "M.S.", bottom: "Professional Accounting" },
  { top: "CPA", bottom: "Candidate" },
  { top: "Tax", bottom: "Preparer" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero title="Meet Anna Huang" tagline="Your Trusted Financial Planning Partner" backgroundImage={IMAGES.heroAbout} />

      <section className="py-20 px-6">
        <div className="container-site grid grid-cols-1 md:grid-cols-[380px_1fr] gap-12">
          <FadeIn direction="left">
            <div className="space-y-6 sticky top-28">
              <Image
                src={IMAGES.annaPhoto}
                alt="Anna Huang - Financial Planner"
                width={380}
                height={253}
                className="w-full h-auto img-grayscale"
              />
              <div className="border border-border p-6">
                {credentialsList.map((cred) => (
                  <div key={cred.top} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
                    <div>
                      <div className="text-lg font-extralight text-foreground leading-tight">{cred.top}</div>
                      <div className="text-text-muted text-sm">{cred.bottom}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="right">
            <div className="space-y-8">
              <div className="border-l-2 border-accent pl-6">
                <p className="text-2xl font-extralight text-foreground leading-snug">
                  &ldquo;No family left behind &mdash; everyone deserves a financial education and
                  planning.&rdquo;
                </p>
              </div>

              {[
                {
                  title: "Experience You Can Trust",
                  text: "With over 11 years of experience in Healthcare Finance and the Insurance industry, Anna brings a wealth of knowledge to the table. She holds Health and Life Insurance licenses, is a Tax Preparer, is pursuing her CPA, and is also a Certified Professional Medical Auditor. Anna specializes in health and life insurances, benefits packages, tax-aware planning, and retirement strategy.",
                },
                {
                  title: "A Personal Journey",
                  text: "As a first-generation immigrant, Anna understands the complexities of navigating health, insurance, and financial planning. Her personal experiences, from managing mortgages to understanding the nuances of financial independence, have shaped her approach to helping others. Anna embraces the principle of \u201cPaying yourself First\u201d and is passionate about sharing her knowledge to empower others.",
                },
                {
                  title: "Beyond Finance",
                  text: "When Anna isn\u2019t helping clients achieve financial independence, you might find her running, swimming, hiking, boxing, crafting, or experimenting with new healthy recipes. Her dedication to a balanced lifestyle mirrors her commitment to holistic well-being in all aspects of life.",
                },
                {
                  title: "Your Trusted Advisor",
                  text: "Anna\u2019s dedication, combined with her extensive experience and personal touch, has earned her a reputation as a trusted advisor in her community. She is passionate about empowering her clients to make informed decisions and achieve their financial goals with confidence.",
                },
              ].map((section) => (
                <div key={section.title}>
                  <h2 className="text-2xl font-extralight text-foreground mb-3">{section.title}</h2>
                  <p className="text-text-secondary leading-relaxed">{section.text}</p>
                </div>
              ))}

              <Button href="/contact">Book a Consultation</Button>
            </div>
          </FadeIn>
        </div>
      </section>

      <CTABanner
        title="Ready to Start Your Financial Journey?"
        text="Your first consultation starts at just $59."
        buttonText="Book a Consultation"
      />
    </>
  );
}
