import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/ui/PageHero";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/motion/FadeIn";
import CTABanner from "@/components/sections/CTABanner";
import { BOOKING_URL, COMMUNITY_EVENTS, EMBEDS, IMAGES, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Events & Appointments",
  description:
    `Book your appointment with ${SITE_NAME}. View upcoming events and schedule your consultation.`,
};

export default function EventsPage() {
  return (
    <>
      <PageHero title="Events & Appointments" tagline="Book your appointment today" backgroundImage={IMAGES.heroEvents} />

      <section className="py-20 px-6">
        <div className="max-w-[800px] mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="heading-lg font-extralight text-foreground mb-4">
                Schedule Your Appointment
              </h2>
              <p className="text-text-secondary leading-relaxed text-lg">
                Ready to take control of your financial future? Book a consultation with Anna and
                get personalized financial planning advice tailored to your family&apos;s needs.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="border border-border p-8 md:p-10 mb-10">
              <h3 className="text-xl font-extralight text-foreground mb-4">How It Works</h3>
              <p className="text-text-secondary mb-5">
                Choose an available time, share your details, and reserve your consultation through
                Anna&apos;s Calendly booking page.
              </p>
              <ol className="space-y-3 text-foreground mb-8">
                {[
                  "Open the consultation booking page",
                  "Choose a date and time that works for you",
                  "Enter your contact details and any notes",
                  "Confirm your appointment",
                  "Receive confirmation and reminders from Calendly",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 bg-foreground text-background text-sm font-medium flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <div className="flex flex-wrap gap-3 mb-8">
                <span className="text-text-secondary text-sm font-medium border border-border px-5 py-2">
                  30-minute consultation
                </span>
                <span className="text-text-secondary text-sm font-medium border border-border px-5 py-2">
                  Online scheduling with Calendly
                </span>
              </div>
              <Button href={BOOKING_URL} external>Book on Calendly</Button>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <SectionHeader
            label="Featured Event"
            title="Community Spotlight"
            subtitle="Current community programming and family-friendly events hosted in University Place."
            align="center"
          />

          <div className="grid grid-cols-1 gap-8">
            {COMMUNITY_EVENTS.map((event) => (
              <FadeIn key={event.title}>
                <div className="border border-border bg-background overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-px bg-border">
                    <div className="bg-background p-6 md:p-8 flex items-center justify-center">
                      <Image
                        src={IMAGES.eventYoungEntrepreneurs}
                        alt="Kids Rummage Sale and Young Entrepreneurs Market flyer"
                        width={700}
                        height={1050}
                        className="w-full max-w-[440px] h-auto border border-border"
                      />
                    </div>

                    <div className="bg-background">
                      <div className="p-8 md:p-10 border-b border-border">
                        <span className="label text-accent block mb-4">March Event</span>
                        <h3 className="text-3xl font-extralight text-foreground mb-4">{event.title}</h3>
                        <p className="text-text-secondary leading-relaxed text-lg mb-6">{event.summary}</p>
                        <div className="flex flex-wrap gap-3 mb-8">
                          <span className="text-sm font-medium border border-border px-4 py-2 text-foreground">
                            {event.date}
                          </span>
                          <span className="text-sm font-medium border border-border px-4 py-2 text-foreground">
                            {event.time}
                          </span>
                          {event.highlights.map((highlight) => (
                            <span
                              key={highlight}
                              className="text-sm font-medium border border-border px-4 py-2 text-text-secondary"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                        <Button href="/contact">Ask About Future Events</Button>
                      </div>

                      <div className="bg-muted p-8 md:p-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <div className="label text-text-muted mb-2">Location</div>
                            <p className="text-foreground leading-relaxed">{event.location}</p>
                          </div>
                          <div>
                            <div className="label text-text-muted mb-2">Hosted By</div>
                            <p className="text-foreground leading-relaxed">{event.sponsor}</p>
                          </div>
                          <div>
                            <div className="label text-text-muted mb-2">Contact</div>
                            <p className="text-foreground leading-relaxed">{event.contactLabel}</p>
                          </div>
                        </div>
                        <p className="text-text-secondary text-sm leading-relaxed mt-6">
                          This event is positioned as a family-friendly, youth-focused community
                          market and learning experience. Reach out if you&apos;d like to hear about
                          future event participation or sponsorship opportunities.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <SectionHeader label="Schedule" title="Calendar" align="center" />
          <FadeIn>
            <p className="text-center text-text-secondary mb-2">
              View upcoming events and availability below.
            </p>
            <p className="text-center text-text-muted text-sm mb-10">
              Events are color-coded by type. Check back regularly for new workshops, classes, and community events.
            </p>
            <div className="border border-border overflow-hidden bg-background">
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
