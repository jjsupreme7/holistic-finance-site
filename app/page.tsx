import HeroSection from "@/components/sections/HeroSection";
import MissionStatement from "@/components/sections/MissionStatement";
import PillarsGrid from "@/components/sections/PillarsGrid";
import StatsCounter from "@/components/sections/StatsCounter";
import CredentialsBar from "@/components/sections/CredentialsBar";
import ServicesGrid from "@/components/sections/ServicesGrid";
import TestimonialsGrid from "@/components/sections/TestimonialsGrid";
import FAQ from "@/components/sections/FAQ";
import ComingSoon from "@/components/sections/ComingSoon";
import NewsletterSignup from "@/components/sections/NewsletterSignup";
import CTABanner from "@/components/sections/CTABanner";
import AboutPreview from "@/components/sections/AboutPreview";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MissionStatement />
      <AboutPreview />
      <PillarsGrid />
      <StatsCounter />
      <CredentialsBar />
      <ServicesGrid />
      <TestimonialsGrid />
      <FAQ />
      <ComingSoon />
      <NewsletterSignup />
      <CTABanner
        title="Ready to Take Control of Your Financial Future?"
        text="Your first consultation starts at just $59. Let us help you build a plan for your family."
        buttonText="Book Your Consultation &mdash; $59"
      />
    </>
  );
}
