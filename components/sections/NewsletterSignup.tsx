"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import FadeIn from "@/components/motion/FadeIn";

export default function NewsletterSignup() {
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
    <section className="py-24 px-6 bg-dark relative overflow-hidden">
      <div className="float-blob w-80 h-80 bg-primary/8 -top-20 -right-20" />
      <div className="float-blob w-64 h-64 bg-gold/8 bottom-10 -left-10" />

      <FadeIn className="max-w-[700px] mx-auto relative z-10">
        <div className="glass-dark gradient-border glow-sm rounded-3xl p-10 md:p-14 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold bg-gold/10 px-4 py-1.5 rounded-full inline-block mb-6">
            Stay Informed
          </span>
          <h2 className="text-3xl md:text-[2.25rem] font-bold text-white mb-3">
            Subscribe to Our Newsletter
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-gold to-gold-light rounded-full mx-auto mb-5" />
          <p className="text-text-on-dark-muted leading-relaxed mb-8 max-w-lg mx-auto">
            Get expert financial insights, market updates, and actionable strategies
            delivered straight to your inbox. Join our community of families building
            lasting wealth.
          </p>

          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-success-bg text-success px-6 py-4 rounded-2xl font-medium"
            >
              {message}
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading"}
                className="flex-1 px-5 py-3.5 rounded-full border-2 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all text-sm disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-gradient-to-r from-gold to-gold-dark text-dark font-bold px-8 py-3.5 rounded-full transition-all hover:shadow-lg hover:shadow-gold/25 hover:-translate-y-0.5 text-sm whitespace-nowrap cursor-pointer border-none disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {status === "loading" ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          )}

          {status === "error" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-600 text-sm mt-3"
            >
              {message}
            </motion.p>
          )}

          <p className="text-white/40 text-xs mt-5">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </FadeIn>
    </section>
  );
}
