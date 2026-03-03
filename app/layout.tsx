import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StickyCTA from "@/components/layout/StickyCTA";
import BackToTop from "@/components/ui/BackToTop";
import PageTransition from "@/components/motion/PageTransition";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Holistic Health and Finance - Personalized Financial Planning in University Place, WA",
    template: "%s - Holistic Health and Finance",
  },
  description:
    "Personalized financial planning, insurance, and retirement services for families in University Place, WA. Over 11 years of experience. Book your $59 first consultation today.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} font-body antialiased`}>
        <Header />
        <main>
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <StickyCTA />
        <BackToTop />
      </body>
    </html>
  );
}
