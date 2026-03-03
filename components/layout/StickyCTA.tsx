"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function StickyCTA() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  // Hide on contact page since they're already there
  const isContactPage = pathname === "/contact";

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (isContactPage) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-40 p-3 md:p-4"
        >
          <div className="max-w-[600px] mx-auto glass-strong rounded-2xl shadow-xl shadow-dark/10 px-5 py-3 flex items-center justify-between gap-4">
            <div className="hidden sm:block">
              <p className="text-dark font-bold text-sm">Ready to start?</p>
              <p className="text-text-muted text-xs">First consultation from $59</p>
            </div>
            <Link
              href="/contact"
              className="bg-gradient-to-r from-gold to-gold-dark text-dark font-bold py-2.5 px-6 rounded-full text-sm no-underline hover:shadow-lg hover:shadow-gold/25 transition-all whitespace-nowrap"
            >
              Book a Consultation
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
