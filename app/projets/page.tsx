"use client";
import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProjectCard from '../../components/ProjectCard';
import Link from 'next/link';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  imageUrl: string | null;
  createdAt: string;
}

export default function ProjetsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects');
        if (!res.ok) {
          throw new Error('Erreur lors du chargement des projets');
        }
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
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

          {loading && (
            <div className="py-20 text-center">
              <div className="inline-block w-12 h-12 mb-4 border-b-2 border-green-600 rounded-full animate-spin"></div>
              <p className="text-xl text-gray-600">Chargement des projets...</p>
            </div>
          )}

          {error && (
            <div className="py-20 text-center">
              <p className="mb-4 text-xl text-red-600">Erreur : {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 font-semibold text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
              >
                Réessayer
              </button>
            </div>
          )}

          {!loading && !error && projects.length === 0 && (
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
          )}

          {!loading && !error && projects.length > 0 && (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((p, i) => (
                <ProjectCard key={p.id} {...p} index={i} />
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
      <Footer />
    </div>
  );
}
