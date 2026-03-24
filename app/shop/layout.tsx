import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Shop",
  description:
    "Preview merchandise and branded products from Holistic Health & Financial Services.",
  path: "/shop",
  index: false,
});

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children;
}
