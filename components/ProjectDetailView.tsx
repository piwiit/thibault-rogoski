"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface ProjectDetailViewProps {
  project: {
    id: number;
    title: string;
    category: string;
    description: string;
    imageUrl: string | null;
    createdAt: string;
  };
}

export default function ProjectDetailView({ project }: ProjectDetailViewProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  return (
    <>
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-semibold text-gray-700 transition-colors border border-gray-200 rounded-lg hover:border-green-600 hover:text-green-600"
      >
        ← Retour
      </button>

      <article className="overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-xl">
        {project.imageUrl ? (
          <div
            className="relative w-full h-96 cursor-pointer group"
            onClick={() => setIsModalOpen(true)}
          >
            <Image
              src={project.imageUrl}
              alt={`${project.title} - ${project.category} - Thibault Rogoski`}
              fill
              priority
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 896px"
            />
            <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-black/0 group-hover:bg-black/30">
              <span className="px-4 py-2 text-sm font-semibold text-white transition-opacity duration-300 bg-green-600 rounded-lg opacity-0 group-hover:opacity-100">
                🔍 Cliquer pour agrandir
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-96 bg-gradient-to-br from-green-100 to-emerald-100 text-7xl">
            🏗️
          </div>
        )}

        <div className="p-8 space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="px-4 py-1 text-sm font-semibold text-green-700 bg-green-100 rounded-full">
              {project.category}
            </span>
            <span className="text-sm text-gray-500">
              Publié le {new Date(project.createdAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
          <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-line">
            {project.description}
          </p>

          <div className="pt-6 border-t border-gray-100">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 text-lg font-semibold text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
            >
              Discuter d&apos;un projet similaire
            </Link>
          </div>
        </div>
      </article>

      {/* Modal pour image agrandie */}
      {isModalOpen && project.imageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-green-400 transition-colors"
            aria-label="Fermer"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div
            className="relative max-w-7xl max-h-[90vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className="object-contain"
              sizes="100vw"
              quality={100}
            />
          </div>
          <p className="absolute bottom-4 text-sm text-white/70">
            Appuyez sur Échap ou cliquez en dehors pour fermer
          </p>
        </div>
      )}
    </>
  );
}
