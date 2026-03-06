import HeroSection from "@/components/sections/HeroSection";
import TrustLogos from "@/components/sections/TrustLogos";
import ServicesGrid from "@/components/sections/ServicesGrid";
import AboutPreview from "@/components/sections/AboutPreview";
import StatsCounter from "@/components/sections/StatsCounter";
import TestimonialsGrid from "@/components/sections/TestimonialsGrid";
import FAQ from "@/components/sections/FAQ";
import CTABanner from "@/components/sections/CTABanner";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustLogos />
      <ServicesGrid />
      <AboutPreview />
      <StatsCounter />
      <TestimonialsGrid />
      <FAQ />
      <CTABanner
        title="Ready to Take Control of Your Financial Future?"
        text="Your first consultation starts at just $59. Let us help you build a plan for your family."
        buttonText="Book Your Consultation &mdash; $59"
      />
    </>
  );
}
