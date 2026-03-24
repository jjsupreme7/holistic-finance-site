import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

export const SITE_URL = "https://myholisticfinance.com";
export const DEFAULT_SOCIAL_IMAGE = "/opengraph-image";

interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  index?: boolean;
}

export function buildPageMetadata({
  title,
  description,
  path,
  keywords,
  index = true,
}: PageMetadataOptions): Metadata {
  const socialTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: socialTitle,
      description,
      url: path,
      images: [
        {
          url: DEFAULT_SOCIAL_IMAGE,
          alt: `${SITE_NAME} social preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [DEFAULT_SOCIAL_IMAGE],
    },
    robots: index
      ? {
          index: true,
          follow: true,
        }
      : {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        },
  };
}
