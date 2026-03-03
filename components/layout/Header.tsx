"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_LINKS, IMAGES, SITE_NAME } from "@/lib/constants";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass-strong shadow-lg shadow-primary/5 py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container-site flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 no-underline group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg group-hover:bg-primary/30 transition-all" />
            <Image
              src={IMAGES.logo}
              alt={SITE_NAME}
              width={64}
              height={43}
              className="rounded-lg relative"
            />
          </div>
          <span className={`font-heading font-bold text-lg hidden sm:inline transition-colors ${
            scrolled ? "text-primary-dark" : "text-white"
          }`}>
            {SITE_NAME}
          </span>
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
              className={`block w-6 h-[2px] rounded transition-all duration-300 ${
                scrolled ? "bg-dark" : "bg-white"
              } ${
                menuOpen && i === 0 ? "rotate-45 translate-y-[7px]" : ""
              } ${
                menuOpen && i === 1 ? "opacity-0" : ""
              } ${
                menuOpen && i === 2 ? "-rotate-45 -translate-y-[7px]" : ""
              }`}
            />
          ))}
        </button>

        <nav
          aria-label="Main navigation"
          className={`md:flex items-center gap-1 ${
            menuOpen
              ? "flex flex-col absolute top-full left-4 right-4 glass-strong rounded-2xl py-4 px-5 shadow-xl mt-2"
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
                className={`relative text-sm font-medium no-underline transition-all px-4 py-2 rounded-lg ${
                  isActive
                    ? scrolled || menuOpen
                      ? "text-primary bg-primary/10 font-bold"
                      : "text-gold font-bold bg-white/10"
                    : scrolled || menuOpen
                      ? "text-text hover:text-primary hover:bg-primary/5"
                      : "text-white/90 hover:text-gold hover:bg-white/10"
                }`}
              >
                {link.label}
                {isActive && !menuOpen && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-current" />
                )}
              </Link>
            );
          })}
          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="bg-gradient-to-r from-gold to-gold-dark text-dark text-sm font-bold px-6 py-2.5 rounded-full no-underline transition-all hover:shadow-lg hover:shadow-gold/25 hover:-translate-y-0.5 ml-2"
          >
            Book a Consultation
          </Link>
        </nav>
      </div>
    </header>
  );
}
