"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SITE_NAME, CONTACT, SOCIAL } from "@/lib/constants";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const hasSocialLinks = SOCIAL.facebook !== "https://facebook.com" || SOCIAL.instagram !== "https://instagram.com";
  const socialLinks = hasSocialLinks ? [
    ...(SOCIAL.facebook !== "https://facebook.com" ? [{ label: "Facebook", href: SOCIAL.facebook }] : []),
    ...(SOCIAL.instagram !== "https://instagram.com" ? [{ label: "Instagram", href: SOCIAL.instagram }] : []),
  ] : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website: honeypot }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
        return;
      }

      setStatus("success");
      setMessage(data.message);
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <footer className="section-dark" role="contentinfo">
      <div className="container-site grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_2fr] gap-10 py-16">
        <div>
          <h4 className="text-lg font-extralight mb-4">{SITE_NAME}</h4>
          <p className="text-sm text-background/50 leading-relaxed">
            {SITE_NAME} provides insurance and financial planning services.
            Mortgage, tax preparation, investment advisory, and legal services are provided
            through appropriately licensed professionals and strategic partners.
          </p>
        </div>

        <div>
          <h4 className="label text-background/50 mb-5">Company</h4>
          <ul className="list-none space-y-3 text-sm">
            {[
              { label: "Start Here", href: "/start-here" },
              { label: "About", href: "/about" },
              { label: "Services", href: "/services" },
              { label: "Events", href: "/events" },
              { label: "Email Updates", href: "/newsletter" },
              { label: "Questions", href: "/contact" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-background/60 no-underline hover:text-accent transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="label text-background/50 mb-5">Contact</h4>
          <ul className="list-none space-y-3 text-sm">
            <li>
              <a href={CONTACT.phoneTel} className="text-background/60 no-underline hover:text-accent transition-colors">
                {CONTACT.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${CONTACT.email}`}
                className="text-background/60 no-underline hover:text-accent transition-colors break-words text-sm leading-relaxed"
              >
                {CONTACT.email}
              </a>
            </li>
            <li className="text-background/50 text-xs">{CONTACT.address}</li>
            {socialLinks.length > 0 && (
              <li className="flex gap-3 pt-2 flex-wrap">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit us on ${s.label}`}
                    className="text-background/50 text-xs no-underline hover:text-accent transition-colors border border-background/15 px-3 py-1"
                  >
                    {s.label}
                  </a>
                ))}
              </li>
            )}
          </ul>
        </div>

        <div>
          <h4 className="label text-background/50 mb-5">Email Updates</h4>
          <p className="text-sm text-background/50 mb-4">
            Blog alerts, class announcements, and event updates delivered to your inbox.
          </p>
          {status === "success" ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-accent text-sm"
            >
              {message}
            </motion.p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-0 relative">
              <div className="absolute opacity-0 -z-10" aria-hidden="true" tabIndex={-1}>
                <input type="text" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} autoComplete="off" tabIndex={-1} />
              </div>
              <input
                type="email"
                required
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading"}
                className="min-w-0 flex-1 px-4 py-2.5 bg-background/5 border border-background/15 text-background placeholder:text-background/30 text-sm focus:outline-none focus:border-accent transition-colors disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full sm:w-auto bg-accent text-foreground font-medium px-5 py-2.5 text-sm cursor-pointer border-none transition-colors hover:bg-accent-dark disabled:opacity-60 whitespace-nowrap"
              >
                {status === "loading" ? "..." : "Subscribe"}
              </button>
            </form>
          )}
          {status === "error" && (
            <p className="text-red-400 text-xs mt-2">{message}</p>
          )}
        </div>
      </div>

      <div className="border-t border-background/10 text-center py-5 text-xs text-background/40">
        &copy; 2026 {SITE_NAME}. All rights reserved.
      </div>
    </footer>
  );
}
