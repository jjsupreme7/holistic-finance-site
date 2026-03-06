"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function NewsletterForm() {
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

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-success-bg text-success px-5 py-4 font-medium text-sm text-center"
      >
        {message}
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="email"
        required
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={status === "loading"}
        className="w-full px-4 py-3 border border-border bg-background/5 text-foreground placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors text-sm disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-accent text-foreground font-medium py-3 px-6 transition-colors hover:bg-accent-dark text-sm cursor-pointer border-none disabled:opacity-60"
      >
        {status === "loading" ? "Subscribing..." : "Subscribe Now"}
      </button>
      {status === "error" && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-500 text-xs text-center"
        >
          {message}
        </motion.p>
      )}
    </form>
  );
}
