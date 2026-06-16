import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { getSiteUrl } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/projets`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  try {
    const projects = await prisma.project.findMany({
      select: { id: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });

    const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
      url: `${siteUrl}/projets/${project.id}`,
      lastModified: project.createdAt,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

    return [...staticPages, ...projectPages];
  } catch {
    return staticPages;
  }
}
