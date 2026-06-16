import type { Metadata } from 'next';
import type { LandingContent } from './landing';

export const SITE_NAME = 'Thibault Rogoski';
export const DEFAULT_OG_IMAGE = '/images/1765122244071_518184455_122245037084207082_2057352680253011563_n__1_.jpg';

export const DEFAULT_KEYWORDS = [
  'terrassement',
  'VRD',
  'voirie et réseaux divers',
  'entretien paysager',
  'aménagement extérieur',
  'artisan BTP',
  'paysagiste',
  'devis gratuit',
  'Thibault Rogoski',
];

export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'http://localhost:3000';
  return url.replace(/\/$/, '');
}

export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return `${getSiteUrl()}${path.startsWith('/') ? path : `/${path}`}`;
}

export function truncateDescription(text: string, maxLength = 160): string {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= maxLength) return cleaned;
  return `${cleaned.slice(0, maxLength - 1).trim()}…`;
}

interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  noIndex?: boolean;
  keywords?: string[];
}

export function buildPageMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
  keywords = DEFAULT_KEYWORDS,
}: PageMetadataOptions): Metadata {
  const siteUrl = getSiteUrl();
  const canonical = absoluteUrl(path);
  const fullTitle = path === '/' ? title : `${title} | ${SITE_NAME}`;
  const ogImage = absoluteUrl(image || DEFAULT_OG_IMAGE);

  return {
    title: fullTitle,
    description,
    keywords,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: 'fr_FR',
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
        },
  };
}

export function buildLocalBusinessJsonLd(content: LandingContent) {
  const siteUrl = getSiteUrl();
  const sameAs = [content.social.facebook, content.social.instagram, content.social.linkedin].filter(
    Boolean
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: content.site.brandName,
    description: content.footer.about,
    url: siteUrl,
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    telephone: content.footer.phone,
    email: content.footer.email,
    areaServed: {
      '@type': 'Country',
      name: 'France',
    },
    serviceType: content.services.items.map((service) => service.title),
    sameAs,
  };
}

export function buildWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: getSiteUrl(),
    inLanguage: 'fr-FR',
  };
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildProjectJsonLd(project: {
  id: number;
  title: string;
  category: string;
  description: string;
  imageUrl: string | null;
  createdAt: Date | string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: truncateDescription(project.description, 300),
    url: absoluteUrl(`/projets/${project.id}`),
    image: project.imageUrl ? absoluteUrl(project.imageUrl) : absoluteUrl(DEFAULT_OG_IMAGE),
    genre: project.category,
    datePublished: new Date(project.createdAt).toISOString(),
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
  };
}
