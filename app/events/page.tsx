import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/motion/FadeIn";
import CTABanner from "@/components/sections/CTABanner";
import { EMBEDS, IMAGES, BOOKING_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Events & Appointments",
  description:
    "Book your appointment with Holistic Health and Finance. View upcoming events and schedule your consultation.",
};

export default function EventsPage() {
  return (
    <>
      <PageHero title="Events & Appointments" tagline="Book your appointment today" backgroundImage={IMAGES.heroEvents} />

      <section className="py-20 px-6 relative overflow-hidden">
        <div className="float-blob w-72 h-72 bg-gold/8 -top-20 right-10" />
        <div className="max-w-[800px] mx-auto relative z-10">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-[2.25rem] font-bold text-white mb-4">
                Schedule Your Appointment
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-gold to-gold-light mx-auto mb-6 rounded-full" />
              <p className="text-white/60 leading-relaxed text-lg">
                Ready to take control of your financial future? Book a consultation with Anna and
                get personalized financial planning advice tailored to your family&apos;s needs.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="glass-dark rounded-3xl p-8 md:p-10 gradient-border glow-sm mb-10">
              <h3 className="text-xl font-bold text-white mb-4">How It Works</h3>
              <p className="text-white/60 mb-5">
                Select a service, choose a time that works for you, and we&apos;ll confirm your
                appointment.
              </p>
              <ol className="space-y-3 text-white/80 mb-8">
                {[
                  "Choose your service (e.g., Consultation)",
                  "Select Zoom or In-Person meeting",
                  "Pick a date and time",
                  "Provide your contact details",
                  "Receive confirmation via email within 24 hours",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary-light text-white text-sm font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <div className="flex flex-wrap gap-3 mb-8">
                <span className="bg-zoom/10 text-zoom text-sm font-medium px-5 py-2 rounded-full border border-zoom/20">
                  Zoom Meeting
                </span>
                <span className="bg-primary/10 text-primary text-sm font-medium px-5 py-2 rounded-full border border-primary/20">
                  In-Person at Office
                </span>
              </div>
              <Button href={BOOKING_URL} external>Book Now &mdash; Starting at $59</Button>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="mesh-gradient-dark py-20 px-6 relative overflow-hidden">
        <div className="float-blob w-56 h-56 bg-primary/8 bottom-0 -left-10" />
        <div className="max-w-[1200px] mx-auto relative z-10">
          <SectionHeader title="Calendar" />
          <FadeIn>
            <p className="text-center text-white/60 mb-2">
              View upcoming events and availability below.
            </p>
            <p className="text-center text-white/40 text-sm mb-10">
              Events are color-coded by type. Check back regularly for new workshops, classes, and community events.
            </p>
            <div className="glass-dark rounded-3xl overflow-hidden gradient-border glow-sm">
              <iframe
                src={EMBEDS.googleCalendar}
                style={{ border: 0 }}
                width="100%"
                height="600"
                title="Google Calendar"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      <CTABanner
        title="Can't Find a Time That Works?"
        text="Reach out to us directly and we'll find a slot that fits your schedule."
        buttonText="Contact Us"
      />
    </>
  );
}
