import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Events & Appointments",
  description:
    "Book a consultation, view upcoming financial events, and explore appointment options at Holistic Health & Financial Services.",
  path: "/events",
  keywords: [
    "financial planning appointment",
    "book consultation",
    "financial events",
    "University Place workshops",
  ],
});

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
