import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import JsonLd from '@/components/JsonLd';
import { buildBreadcrumbJsonLd, buildPageMetadata, buildProjectJsonLd, truncateDescription } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const id = parseInt((await params).id);

  if (isNaN(id)) {
    return buildPageMetadata({
      title: 'Projet introuvable',
      description: 'Ce projet n\'existe pas ou a été supprimé.',
      path: '/projets',
      noIndex: true,
    });
  }

  try {
    const project = await prisma.project.findUnique({ where: { id } });

    if (!project) {
      return buildPageMetadata({
        title: 'Projet introuvable',
        description: 'Ce projet n\'existe pas ou a été supprimé.',
        path: '/projets',
        noIndex: true,
      });
    }

    return buildPageMetadata({
      title: project.title,
      description: truncateDescription(`${project.category}. ${project.description}`),
      path: `/projets/${project.id}`,
      image: project.imageUrl,
      keywords: [project.category, project.title, 'réalisation', 'Thibault Rogoski'],
    });
  } catch {
    return buildPageMetadata({
      title: 'Projet',
      description: 'Détail d\'une réalisation Thibault Rogoski.',
      path: `/projets/${id}`,
    });
  }
}

export default async function ProjectDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const id = parseInt((await params).id);
  let jsonLd: Record<string, unknown> | null = null;
  let breadcrumb: Record<string, unknown> | null = null;

  if (!isNaN(id)) {
    try {
      const project = await prisma.project.findUnique({ where: { id } });
      if (project) {
        jsonLd = buildProjectJsonLd(project);
        breadcrumb = buildBreadcrumbJsonLd([
          { name: 'Accueil', path: '/' },
          { name: 'Réalisations', path: '/projets' },
          { name: project.title, path: `/projets/${project.id}` },
        ]);
      }
    } catch {
      // ignore
    }
  }

  return (
    <>
      {jsonLd && breadcrumb && <JsonLd data={[jsonLd, breadcrumb]} />}
      {children}
    </>
  );
}
