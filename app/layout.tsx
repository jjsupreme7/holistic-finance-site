import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import PageTracker from "@/components/PageTracker";
import LayoutShell from "@/components/layout/LayoutShell";
import { SITE_NAME } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} - Personalized Financial Planning in University Place, WA`,
    template: `%s - ${SITE_NAME}`,
  },
  description:
    `${SITE_NAME} offers personalized financial planning, insurance, tax preparation, and retirement guidance for families in University Place, WA. Book a consultation today.`,
  metadataBase: new URL("https://myholisticfinance.com"),
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: `${SITE_NAME} - Personalized Financial Planning`,
    description:
      `${SITE_NAME} provides personalized financial planning, insurance, tax preparation, and retirement guidance for families in University Place, WA.`,
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description:
      `${SITE_NAME} provides personalized financial planning, insurance, tax preparation, and retirement guidance for families in University Place, WA.`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Holistic Health & Financial Services",
  description:
    "Personalized financial planning, insurance, tax preparation, and retirement guidance for families in University Place, WA.",
  url: "https://myholisticfinance.com",
  telephone: "+1-253-666-8663",
  email: "Holistic.Health.Finance@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "7017 27th St W, Suite #6",
    addressLocality: "University Place",
    addressRegion: "WA",
    postalCode: "98466",
    addressCountry: "US",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "16:00",
    },
  ],
  priceRange: "$$",
  image: "https://myholisticfinance.com/logo.svg",
};

const jsonLdString = JSON.stringify(jsonLd);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString }}
        />
      </head>
      <body className={`${inter.variable} font-body antialiased`}>
        <LayoutShell>{children}</LayoutShell>
        <PageTracker />
        <Analytics />
      </body>
    </html>
  );
}
