"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { BOOKING_URL } from "@/lib/constants";

export default function StickyCTA() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

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
          <div className="max-w-[600px] mx-auto bg-foreground px-5 py-3 flex items-center justify-between gap-4">
            <div className="hidden sm:block">
              <p className="text-background font-medium text-sm">Ready to start?</p>
              <p className="text-background/50 text-xs">Schedule directly on Calendly</p>
            </div>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent text-foreground font-medium py-2.5 px-6 text-sm no-underline hover:bg-accent-dark transition-colors whitespace-nowrap"
            >
              Book a Consultation
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
