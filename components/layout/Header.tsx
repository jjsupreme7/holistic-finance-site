"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { trackBookingClick } from "@/lib/analytics/tracking";
import { BOOKING_URL, NAV_LINKS, IMAGES, SITE_NAME } from "@/lib/constants";

const logoWhite = IMAGES.logo;
const logoDark = IMAGES.logoDark;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      setHidden(y > 100 && y > lastScrollY.current);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        hidden && !menuOpen ? "-translate-y-full" : "translate-y-0"
      } ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container-site flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <Image
            src={scrolled ? logoDark : logoWhite}
            alt={SITE_NAME}
            width={300}
            height={48}
            className="relative w-[220px] md:w-[250px] lg:w-[300px] h-auto"
            priority
          />
        </Link>

        <button
          className="md:hidden flex flex-col gap-[5px] bg-transparent border-none cursor-pointer p-2 z-50"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`block w-6 h-[2px] transition-all duration-300 ${
                scrolled ? "bg-foreground" : "bg-white"
              } ${
                menuOpen && i === 0 ? "rotate-45 translate-y-[7px] !bg-foreground" : ""
              } ${
                menuOpen && i === 1 ? "opacity-0" : ""
              } ${
                menuOpen && i === 2 ? "-rotate-45 -translate-y-[7px] !bg-foreground" : ""
              }`}
            />
          ))}
        </button>

        <nav
          aria-label="Main navigation"
          className={`md:flex items-center gap-1 ${
            menuOpen
              ? "flex flex-col absolute top-full left-0 right-0 bg-background border-b border-border py-6 px-6"
              : "hidden"
          }`}
        >
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={`relative text-xs uppercase tracking-[0.2em] no-underline transition-all px-4 py-2 ${
                  isActive
                    ? `font-medium ${scrolled || menuOpen ? "text-foreground" : "text-white"}`
                    : `${scrolled || menuOpen ? "text-text-secondary hover:text-foreground" : "text-white/70 hover:text-white"}`
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-4 right-4 h-px bg-current" />
                )}
              </Link>
            );
          })}
          <a
            href={BOOKING_URL}
            onClick={() => {
              trackBookingClick("header_cta");
              setMenuOpen(false);
            }}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent text-foreground text-xs uppercase tracking-[0.15em] font-medium px-4 lg:px-6 py-2.5 no-underline transition-colors hover:bg-accent-dark ml-2"
          >
            Book a Consultation
          </a>
        </nav>
      </div>
    </header>
  );
}
