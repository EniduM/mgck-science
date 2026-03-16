import type { Metadata } from 'next';

export const SITE_NAME = "Mahamaya Girls' College Senior Science Society";
export const SITE_URL = 'https://www.mayanzsci.org.lk';
export const DEFAULT_DESCRIPTION =
  "Official website of the Mahamaya Girls' College Senior Science Society featuring events, achievements, research papers and science activities.";

const DEFAULT_IMAGE = '/Logos/2.png';

export function buildMetadata(input?: {
  title?: string;
  description?: string;
  path?: string;
  index?: boolean;
}): Metadata {
  const title = input?.title ?? SITE_NAME;
  const description = input?.description ?? DEFAULT_DESCRIPTION;
  const path = input?.path ?? '/';
  const index = input?.index ?? true;

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      type: 'website',
      images: [
        {
          url: DEFAULT_IMAGE,
          width: 512,
          height: 512,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_IMAGE],
    },
    robots: {
      index,
      follow: index,
      googleBot: {
        index,
        follow: index,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  };
}
