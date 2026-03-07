import type { Metadata } from "next";
import { Inter } from "next/font/google";
import LayoutShell from "@/components/layout/LayoutShell";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Holistic Health and Finance - Personalized Financial Planning in University Place, WA",
    template: "%s - Holistic Health and Finance",
  },
  description:
    "Personalized financial planning, insurance, and retirement services for families in University Place, WA. Over 11 years of experience. Book your $59 first consultation today.",
  metadataBase: new URL("https://myholisticfinance.com"),
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Holistic Health and Finance",
    title: "Holistic Health and Finance - Personalized Financial Planning",
    description:
      "Personalized financial planning, insurance, and retirement services for families in University Place, WA. Over 11 years of experience.",
  },
  twitter: {
    card: "summary",
    title: "Holistic Health and Finance",
    description:
      "Personalized financial planning, insurance, and retirement services for families in University Place, WA.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-body antialiased`}>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
