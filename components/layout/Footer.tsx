"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SITE_NAME, CONTACT, SOCIAL } from "@/lib/constants";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
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
            Holistic Health &amp; Finance provides insurance and financial planning services.
            Mortgage, tax preparation, investment advisory, and legal services are provided
            through appropriately licensed professionals and strategic partners.
          </p>
        </div>

        <div>
          <h4 className="label text-background/50 mb-5">Company</h4>
          <ul className="list-none space-y-3 text-sm">
            {[
              { label: "About", href: "/about" },
              { label: "Services", href: "/services" },
              { label: "Events", href: "/events" },
              { label: "Newsletter", href: "/newsletter" },
              { label: "Contact Us", href: "/contact" },
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
              <a href={`mailto:${CONTACT.email}`} className="text-background/60 no-underline hover:text-accent transition-colors break-all text-xs">
                {CONTACT.email}
              </a>
            </li>
            <li className="text-background/50 text-xs">{CONTACT.address}</li>
            <li className="flex gap-3 pt-2">
              {[
                { label: "Facebook", href: SOCIAL.facebook },
                { label: "Instagram", href: SOCIAL.instagram },
              ].map((s) => (
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
          </ul>
        </div>

        <div>
          <h4 className="label text-background/50 mb-5">Newsletter</h4>
          <p className="text-sm text-background/50 mb-4">
            Financial insights delivered to your inbox.
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
            <form onSubmit={handleSubmit} className="flex gap-0">
              <input
                type="email"
                required
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading"}
                className="flex-1 px-4 py-2.5 bg-background/5 border border-background/15 text-background placeholder:text-background/30 text-sm focus:outline-none focus:border-accent transition-colors disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-accent text-foreground font-medium px-5 py-2.5 text-sm cursor-pointer border-none transition-colors hover:bg-accent-dark disabled:opacity-60 whitespace-nowrap"
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
