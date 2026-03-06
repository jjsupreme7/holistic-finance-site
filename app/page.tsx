import HeroSection from "@/components/sections/HeroSection";
import TrustLogos from "@/components/sections/TrustLogos";
import AboutPreview from "@/components/sections/AboutPreview";
import HowItWorks from "@/components/sections/HowItWorks";
import ServicesGrid from "@/components/sections/ServicesGrid";
import StatsCounter from "@/components/sections/StatsCounter";
import CredentialsBar from "@/components/sections/CredentialsBar";
import TestimonialsGrid from "@/components/sections/TestimonialsGrid";
import FAQ from "@/components/sections/FAQ";
import ComingSoon from "@/components/sections/ComingSoon";
import NewsletterSignup from "@/components/sections/NewsletterSignup";
import CTABanner from "@/components/sections/CTABanner";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustLogos />
      <AboutPreview />
      <HowItWorks />
      <ServicesGrid />
      <StatsCounter />
      <CredentialsBar />
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
