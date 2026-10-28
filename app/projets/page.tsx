import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProjectCard from '@/components/ProjectCard';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getLandingContent } from '@/lib/landing';

export const dynamic = 'force-dynamic';

export default async function ProjetsPage() {
  const [projects, landingContent] = await Promise.all([
    prisma.project.findMany({ orderBy: { createdAt: 'desc' } }),
    getLandingContent(),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar landingContent={landingContent} />
      <main className="flex-1 pt-24 pb-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">
              Nos réalisations
            </h1>
            <p className="text-xl text-gray-600">
              Découvrez quelques-uns de nos projets récents
            </p>
          </div>

          {projects.length === 0 ? (
            <div className="py-20 text-center">
              <div className="mb-4 text-6xl">📋</div>
              <p className="mb-4 text-xl text-gray-600">Aucun projet disponible pour le moment.</p>
              <Link
                href="/contact"
                className="inline-block px-6 py-3 font-semibold text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
              >
                Contactez-nous pour un devis
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <ProjectCard
                  key={p.id}
                  id={p.id}
                  title={p.title}
                  category={p.category}
                  description={p.description}
                  imageUrl={p.imageUrl}
                />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-gray-700 transition-colors border-2 border-gray-300 rounded-lg hover:border-green-600 hover:text-green-600"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </main>
      <Footer landingContent={landingContent} />
    </div>
  );
}
