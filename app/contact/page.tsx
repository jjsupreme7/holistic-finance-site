"use client";

import { useState } from "react";
import PageHero from "@/components/ui/PageHero";
import FadeIn from "@/components/motion/FadeIn";
import Icon from "@/components/ui/Icon";
import CTABanner from "@/components/sections/CTABanner";
import { CONTACT, SERVICE_OPTIONS, EMBEDS } from "@/lib/constants";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      <PageHero title="Contact Us" tagline="Start your journey to financial freedom today" />

      <section className="py-20 px-6 relative overflow-hidden">
        <div className="float-blob w-80 h-80 bg-primary/8 -top-20 -right-20" />
        <div className="float-blob w-56 h-56 bg-gold/6 bottom-20 -left-10" />
        <div className="container-site">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-text-light max-w-2xl mx-auto mb-3">
                Your information is kept confidential. Fill out the form below and we&apos;ll be
                in touch within one business day.
              </p>
              <span className="inline-block text-sm bg-success-bg text-success px-5 py-2 rounded-full font-medium">
                You&apos;ll receive a confirmation within 24 hours of reaching out.
              </span>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] lg:grid-cols-[1fr_400px] gap-10">
            <FadeIn direction="left">
              {submitted ? (
                <div className="glass rounded-3xl p-12 text-center gradient-border glow-gold">
                  <div className="text-primary mb-5 flex justify-center">
                    <Icon name="certified" size={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-dark mb-3">Message Sent!</h3>
                  <p className="text-text-light text-lg">
                    Thank you for reaching out. We&apos;ll be in touch within one business day.
                  </p>
                </div>
              ) : (
                <div className="glass rounded-3xl p-8 md:p-10 gradient-border glow-sm">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-dark mb-2">
                          First Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="firstName"
                          type="text"
                          required
                          aria-required="true"
                          placeholder="Your first name"
                          className="w-full bg-white/60 backdrop-blur-sm border border-border-light rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-dark mb-2">
                          Last Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="lastName"
                          type="text"
                          required
                          aria-required="true"
                          placeholder="Your last name"
                          className="w-full bg-white/60 backdrop-blur-sm border border-border-light rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-dark mb-2">
                        Email <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        aria-required="true"
                        placeholder="your@email.com"
                        className="w-full bg-white/60 backdrop-blur-sm border border-border-light rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-dark mb-2">Phone</label>
                      <input
                        id="phone"
                        type="tel"
                        placeholder="(253) 555-0000"
                        className="w-full bg-white/60 backdrop-blur-sm border border-border-light rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
                      />
                    </div>

                    <div>
                      <label htmlFor="service" className="block text-sm font-medium text-dark mb-2">
                        Service of Interest
                      </label>
                      <select
                        id="service"
                        className="w-full bg-white/60 backdrop-blur-sm border border-border-light rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
                      >
                        <option value="">Select a service...</option>
                        {SERVICE_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-dark mb-2">Message</label>
                      <textarea
                        id="message"
                        rows={5}
                        placeholder="Tell us about your financial planning needs..."
                        className="w-full bg-white/60 backdrop-blur-sm border border-border-light rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all resize-y"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-gradient-to-r from-primary to-primary-light text-white font-bold py-3.5 px-8 rounded-full text-[1.05rem] hover:shadow-xl hover:shadow-primary/25 transition-all hover:-translate-y-1 cursor-pointer border-none w-full sm:w-auto"
                    >
                      Send Message
                    </button>
                  </form>
                </div>
              )}
            </FadeIn>

            <FadeIn direction="right">
              <div className="space-y-6">
                <div className="glass rounded-3xl p-8 gradient-border glow-sm">
                  <h3 className="text-xl font-bold text-dark mb-6">Get in Touch</h3>
                  <div className="space-y-5">
                    {[
                      {
                        iconName: "phone" as const,
                        label: "Phone",
                        content: <a href={CONTACT.phoneTel} className="text-primary no-underline hover:underline font-medium">{CONTACT.phone}</a>,
                      },
                      {
                        iconName: "email" as const,
                        label: "Email",
                        content: <a href={`mailto:${CONTACT.email}`} className="text-primary no-underline hover:underline break-all text-sm font-medium">{CONTACT.email}</a>,
                      },
                      {
                        iconName: "office" as const,
                        label: "Office",
                        content: <span className="text-text-light text-sm">{CONTACT.address}</span>,
                      },
                      {
                        iconName: "zoom" as const,
                        label: "Zoom Meeting",
                        content: <span className="text-text-light text-sm">Available for virtual consultations. Request a Zoom link when booking.</span>,
                      },
                      {
                        iconName: "hours" as const,
                        label: "Hours",
                        content: <span className="text-text-light text-sm">{CONTACT.hours}<br />{CONTACT.weekendHours}</span>,
                      },
                    ].map((item) => (
                      <div key={item.label} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0 text-primary">
                          <Icon name={item.iconName} size={18} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">{item.label}</div>
                          {item.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass rounded-3xl overflow-hidden gradient-border glow-sm">
                  <iframe
                    src={EMBEDS.googleMaps}
                    style={{ border: 0 }}
                    width="100%"
                    height="220"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Office Location"
                  />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <CTABanner
        title="Prefer to Call?"
        text="Give us a ring at (253) 666-8663 during business hours."
        buttonText="View Our Services"
        buttonHref="/services"
      />
    </>
  );
}
