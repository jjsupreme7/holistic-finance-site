import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Financial Planning Services",
  description:
    "Explore retirement planning, insurance guidance, tax preparation, mortgage planning, and family-focused financial services from Holistic Health & Financial Services.",
  path: "/services",
  keywords: [
    "financial planning services",
    "retirement planning",
    "tax preparation",
    "insurance guidance",
    "mortgage planning",
  ],
});

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
