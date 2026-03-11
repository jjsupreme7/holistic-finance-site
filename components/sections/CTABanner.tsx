"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import FadeIn from "@/components/motion/FadeIn";
import Button from "@/components/ui/Button";

interface CTABannerProps {
  title: string;
  text: string;
  buttonText: string;
  buttonHref?: string;
  buttonExternal?: boolean;
}

export default function CTABanner({
  title,
  text,
  buttonText,
  buttonHref = "/contact",
  buttonExternal = false,
}: CTABannerProps) {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

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
    <section className="section-dark py-24 px-6">
      <FadeIn className="container-site">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="heading-lg font-extralight text-background mb-5">{title}</h2>
            <p className="text-lg text-background/60 mb-10 max-w-xl leading-relaxed">{text}</p>
            <Button href={buttonHref} variant="primary" external={buttonExternal}>{buttonText}</Button>
          </div>
          <div>
            <span className="label text-background/50 block mb-4">Stay Informed</span>
            <p className="text-background/60 text-sm mb-5">
              Get expert financial insights delivered straight to your inbox.
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
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading"}
                  className="min-w-0 flex-1 px-4 py-3 bg-background/5 border border-background/15 text-background placeholder:text-background/30 text-sm focus:outline-none focus:border-accent transition-colors disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full sm:w-auto bg-accent text-foreground font-medium px-6 py-3 text-sm cursor-pointer border-none transition-colors hover:bg-accent-dark disabled:opacity-60 whitespace-nowrap"
                >
                  {status === "loading" ? "..." : "Subscribe"}
                </button>
              </form>
            )}
            {status === "error" && (
              <p className="text-red-400 text-xs mt-2">{message}</p>
            )}
            <p className="text-background/30 text-xs mt-3">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
