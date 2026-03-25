import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Financial Calculators",
  description:
    "Use free financial calculators for retirement, mortgage affordability, life insurance needs, and college savings planning.",
  path: "/tools",
  keywords: [
    "financial calculators",
    "retirement calculator",
    "mortgage calculator",
    "life insurance calculator",
    "college savings calculator",
  ],
});

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
