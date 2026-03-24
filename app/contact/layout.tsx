import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact Anna Huang",
  description:
    "Contact Holistic Health & Financial Services for financial planning questions, event inquiries, or custom appointment requests in University Place, WA.",
  path: "/contact",
  keywords: [
    "contact financial planner",
    "University Place financial planning",
    "custom appointment request",
    "Anna Huang contact",
  ],
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
