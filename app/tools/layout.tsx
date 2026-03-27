import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Financial Calculators & Tools",
  description:
    "Free financial calculators for retirement savings, mortgage affordability, life insurance needs, and college savings planning from Holistic Health & Financial Services.",
  path: "/tools",
  keywords: [
    "financial calculators",
    "retirement calculator",
    "mortgage calculator",
    "college savings calculator",
    "life insurance calculator",
  ],
});

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
