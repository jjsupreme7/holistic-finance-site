"use client";

import { useEffect, useRef, useState } from "react";
import PageHero from "@/components/ui/PageHero";
import FadeIn from "@/components/motion/FadeIn";
import Icon from "@/components/ui/Icon";
import CTABanner from "@/components/sections/CTABanner";
import Button from "@/components/ui/Button";
import { BOOKING_URL, CONTACT, SERVICE_OPTIONS, EMBEDS, IMAGES } from "@/lib/constants";

type Status = "idle" | "loading" | "success" | "error";

export default function ContactPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [coursePrefill, setCoursePrefill] = useState("");
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setCoursePrefill(searchParams.get("course") || "");

    const form = formRef.current;
    if (!form) return;

    const serviceField = form.elements.namedItem("service") as HTMLSelectElement | null;
    const messageField = form.elements.namedItem("message") as HTMLTextAreaElement | null;

    if (serviceField) {
      serviceField.value = searchParams.get("service") || "";
    }

    if (messageField) {
      messageField.value = searchParams.get("message") || "";
    }
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = {
      firstName: (form.elements.namedItem("firstName") as HTMLInputElement).value,
      lastName: (form.elements.namedItem("lastName") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value || undefined,
      service: (form.elements.namedItem("service") as HTMLSelectElement).value || undefined,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value || undefined,
      website: (form.elements.namedItem("website") as HTMLInputElement).value || undefined,
    };

    try {
      const res = await fetch("/api/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Something went wrong.");
      }

      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  const inputClass =
    "w-full bg-background border border-border px-4 py-3 text-foreground placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors";

  return (
    <>
      <PageHero
        title="Questions & Custom Requests"
        tagline="Use this page for general questions, event inquiries, or help when you are not ready to book directly"
        backgroundImage={IMAGES.heroContact}
      />

      <section className="py-20 px-6">
        <div className="container-site">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-text-secondary max-w-3xl mx-auto mb-4">
                Use this form for general questions, event details, custom scheduling requests, or
                anything that needs a reply before booking. If you already know you want a
                consultation, use the direct scheduling link instead.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 mb-3">
                <Button href={BOOKING_URL} external>Book a Consultation</Button>
                <Button href="#question-form" variant="outline">Ask a Question Instead</Button>
              </div>
              <span className="inline-block text-sm text-success font-medium">
                We&apos;ll reply within one business day.
              </span>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] lg:grid-cols-[1fr_400px] gap-10">
            <FadeIn direction="left">
              {status === "success" ? (
                <div className="border border-border p-12 text-center">
                  <div className="text-accent mb-5 flex justify-center">
                    <Icon name="certified" size={48} />
                  </div>
                  <h3 className="text-2xl font-extralight text-foreground mb-3">Message Sent!</h3>
                  <p className="text-text-secondary text-lg">
                    Thank you for reaching out. We&apos;ll be in touch within one business day.
                  </p>
                </div>
              ) : (
                <div id="question-form" className="border border-border p-8 md:p-10">
                  <div className="mb-8">
                    <span className="inline-block label text-accent mb-3">General Questions</span>
                    <h2 className="text-2xl font-extralight text-foreground mb-3">
                      {coursePrefill ? `Ask about ${coursePrefill}.` : "Send a message instead of booking."}
                    </h2>
                    <p className="text-text-secondary leading-relaxed">
                      {coursePrefill
                        ? "Use this form to request a class spot or ask course questions. We’ll follow up with the next steps instead of sending you to the consultation calendar."
                        : "This is the best option if you want help choosing a service, need a custom time, have an event question, or prefer to talk before scheduling."}
                    </p>
                  </div>
                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          required
                          aria-required="true"
                          placeholder="Your first name"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          required
                          aria-required="true"
                          placeholder="Your last name"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        aria-required="true"
                        placeholder="your@email.com"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">Phone</label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="(253) 555-0000"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="service" className="block text-sm font-medium text-foreground mb-2">
                        Service of Interest
                      </label>
                      <select
                        id="service"
                        name="service"
                        className={inputClass}
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
                      <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        placeholder="Tell us what you need help with..."
                        className={`${inputClass} resize-y`}
                      />
                    </div>

                    <div className="absolute opacity-0 -z-10" aria-hidden="true" tabIndex={-1}>
                      <label htmlFor="website">Website</label>
                      <input type="text" id="website" name="website" autoComplete="off" tabIndex={-1} />
                    </div>

                    {status === "error" && (
                      <p className="text-red-500 text-sm">{errorMsg}</p>
                    )}

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="bg-accent text-foreground font-medium py-3.5 px-8 text-sm uppercase tracking-[0.15em] transition-colors hover:bg-accent-dark cursor-pointer border-none w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {status === "loading" ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        "Send Message"
                      )}
                    </button>
                  </form>
                </div>
              )}
            </FadeIn>

            <FadeIn direction="right">
              <div className="space-y-6">
                <div className="border border-border p-8">
                  <h3 className="text-xl font-extralight text-foreground mb-6">Get in Touch</h3>
                  <div className="space-y-5">
                    {[
                      {
                        iconName: "phone" as const,
                        label: "Phone",
                        content: <a href={CONTACT.phoneTel} className="text-foreground no-underline hover:text-accent transition-colors font-medium">{CONTACT.phone}</a>,
                      },
                      {
                        iconName: "email" as const,
                        label: "Email",
                        content: (
                          <a
                            href={`mailto:${CONTACT.email}`}
                            className="text-foreground no-underline hover:text-accent transition-colors break-words text-sm font-medium leading-relaxed"
                          >
                            {CONTACT.email}
                          </a>
                        ),
                      },
                      {
                        iconName: "office" as const,
                        label: "Office",
                        content: <span className="text-text-secondary text-sm">{CONTACT.address}</span>,
                      },
                      {
                        iconName: "zoom" as const,
                        label: "Zoom Meeting",
                        content: <span className="text-text-secondary text-sm">Available for virtual consultations. Request a Zoom link when booking.</span>,
                      },
                      {
                        iconName: "hours" as const,
                        label: "Hours",
                        content: <span className="text-text-secondary text-sm">{CONTACT.hours}<br />{CONTACT.weekendHours}</span>,
                      },
                    ].map((item) => (
                      <div key={item.label} className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-muted flex items-center justify-center flex-shrink-0 text-text-muted">
                          <Icon name={item.iconName} size={18} />
                        </div>
                        <div>
                          <div className="label text-text-muted mb-1">{item.label}</div>
                          {item.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-border overflow-hidden">
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
