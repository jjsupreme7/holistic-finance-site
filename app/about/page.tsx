import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/ui/PageHero";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/motion/FadeIn";
import Icon from "@/components/ui/Icon";
import CTABanner from "@/components/sections/CTABanner";
import { IMAGES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Anna Huang",
  description:
    "Meet Anna Huang - 11+ years of experience in Healthcare Finance and Insurance. Licensed Health and Life Insurance agent and Certified Professional Medical Auditor in University Place, WA.",
};

const credentialsList = [
  { top: "11+ Years", bottom: "Experience", icon: "experience" as const },
  { top: "Licensed", bottom: "Health & Life", icon: "licensed" as const },
  { top: "CPMA", bottom: "Certified", icon: "certified" as const },
];

export default function AboutPage() {
  return (
    <>
      <PageHero title="Meet Anna Huang" tagline="Your Trusted Financial Planning Partner" />

      <section className="py-20 px-6 relative overflow-hidden">
        <div className="float-blob w-72 h-72 bg-primary/8 -top-20 -right-20" />
        <div className="container-site grid grid-cols-1 md:grid-cols-[380px_1fr] gap-12">
          <FadeIn direction="left">
            <div className="space-y-6 sticky top-28">
              <div className="relative">
                <div className="absolute -inset-3 bg-gradient-to-br from-primary/20 to-gold/20 rounded-3xl blur-xl" />
                <Image
                  src={IMAGES.annaPhoto}
                  alt="Anna Huang - Financial Planner"
                  width={380}
                  height={253}
                  className="rounded-2xl shadow-xl w-full h-auto relative"
                />
              </div>
              <div className="glass rounded-2xl p-6 gradient-border glow-sm">
                {credentialsList.map((cred) => (
                  <div key={cred.top} className="flex items-center gap-3 py-3 border-b border-border-light last:border-0">
                    <span className="text-primary">
                      <Icon name={cred.icon} size={22} />
                    </span>
                    <div>
                      <div className="font-bold text-gradient text-lg leading-tight">{cred.top}</div>
                      <div className="text-text-muted text-sm">{cred.bottom}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="right">
            <div className="space-y-8">
              <div className="glass rounded-2xl p-6 gradient-border italic">
                <p className="font-heading text-xl text-dark leading-relaxed">
                  &ldquo;No family left behind &mdash; everyone deserves a financial education and
                  planning.&rdquo;
                </p>
              </div>

              {[
                {
                  title: "Experience You Can Trust",
                  text: "With over 11 years of experience in Healthcare Finance and the Insurance industry, Anna brings a wealth of knowledge to the table. She holds Health and Life Insurance licenses and is also a Certified Professional Medical Auditor. Anna specializes in health and life insurances, benefits packages, and retirement planning.",
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
                  <h2 className="text-2xl font-bold text-dark mb-3">{section.title}</h2>
                  <p className="text-text-light leading-relaxed">{section.text}</p>
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
