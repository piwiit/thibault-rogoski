import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProjectDetailView from '@/components/ProjectDetailView';
import { prisma } from '@/lib/prisma';
import { getLandingContent } from '@/lib/landing';

export const dynamic = 'force-dynamic';

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = parseInt((await params).id, 10);
  if (isNaN(id)) {
    notFound();
  }

  const [project, landingContent] = await Promise.all([
    prisma.project.findUnique({ where: { id } }),
    getLandingContent(),
  ]);

  if (!project) {
    notFound();
  }

  const serializedProject = {
    ...project,
    createdAt: project.createdAt.toISOString(),
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar landingContent={landingContent} />
      <main className="flex-1 pt-24 pb-20">
        <div className="px-4 mx-auto max-w-5xl sm:px-6 lg:px-8">
          <ProjectDetailView project={serializedProject} />
        </div>
      </main>
      <Footer landingContent={landingContent} />
    </div>
  );
}
