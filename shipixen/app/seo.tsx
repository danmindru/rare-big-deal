import { Metadata } from 'next';
import { siteConfig } from '@/data/config/site.settings';

interface PageSEOProps {
  title: string;
  description?: string;
  image?: string;
  canonical?: string;
  alternates?: {
    canonical?: string;
    types?: Record<string, string>;
  };
}

export function genPageMetadata({
  title,
  description,
  image,
  canonical,
  ...rest
}: PageSEOProps): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description: description || siteConfig.description,
      url: './',
      siteName: siteConfig.title,
      images: image ? [image] : [siteConfig.socialBanner],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      title: `${title} | ${siteConfig.title}`,
      card: 'summary_large_image',
      images: image ? [image] : [siteConfig.socialBanner],
    },
    ...(canonical
      ? {
          alternates: {
            canonical,
          },
        }
      : {}),
    ...rest,
  };
}
