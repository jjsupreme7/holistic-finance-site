"use client";

import Link from "next/link";
import { BOOKING_URL } from "@/lib/constants";
import { trackBookingClick } from "@/lib/analytics/tracking";

interface ButtonProps {
  href: string;
  variant?: "primary" | "outline" | "dark";
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  trackingLabel?: string;
}

export default function Button({
  href,
  variant = "primary",
  children,
  className = "",
  external,
  trackingLabel,
}: ButtonProps) {
  const base =
    "inline-block font-medium text-center transition-colors duration-200 no-underline text-sm uppercase tracking-[0.15em] px-8 py-3.5";

  const variants = {
    primary: "bg-accent text-foreground hover:bg-accent-dark",
    outline: "border border-foreground text-foreground hover:bg-foreground hover:text-background",
    dark: "border border-background text-background hover:bg-background hover:text-foreground",
  };

  const classes = `${base} ${variants[variant]} ${className}`;
  const handleClick =
    href === BOOKING_URL ? () => trackBookingClick(trackingLabel) : undefined;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} onClick={handleClick}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} onClick={handleClick}>
      {children}
    </Link>
  );
}
