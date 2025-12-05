"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProjectForm from '../../components/ProjectForm';
import ChangePasswordForm from '../../components/ChangePasswordForm';
import SocialLinksForm from '../../components/SocialLinksForm';
import Link from 'next/link';

interface Project {
    id: number;
    title: string;
    category: string;
    description: string;
    imageUrl: string | null;
    createdAt: string;
}

export default function AdminPage() {
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [showSocialForm, setShowSocialForm] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [user, setUser] = useState<{ id: number; username: string } | null>(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    async function checkAuth() {
        try {
            const res = await fetch('/api/auth/me');
            if (!res.ok) {
                router.push('/login');
                return;
            }
            const data = await res.json();
            setUser(data.user);
            fetchProjects();
        } catch (err) {
            router.push('/login');
        } finally {
            setAuthLoading(false);
            setLoading(false);
        }
    }

    async function fetchProjects() {
        try {
            const res = await fetch('/api/projects');
            if (!res.ok) throw new Error('Erreur lors du chargement');
            const data = await res.json();
            setProjects(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: number) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
            return;
        }

        setDeletingId(id);
        try {
            const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Erreur lors de la suppression');
            await fetchProjects();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Erreur lors de la suppression');
        } finally {
            setDeletingId(null);
        }
    }

    function handleEdit(project: Project) {
        setEditingProject(project);
        setShowForm(true);
    }

    function handleFormSuccess() {
        setShowForm(false);
        setEditingProject(null);
        fetchProjects();
    }

    function handleFormCancel() {
        setShowForm(false);
        setEditingProject(null);
    }

    async function handleLogout() {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    }

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="inline-block w-12 h-12 mb-4 border-b-2 border-green-600 rounded-full animate-spin"></div>
                        <p className="text-gray-600">Chargement...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="pt-24 pb-20">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="mb-2 text-4xl font-bold text-gray-900">Administration</h1>
                                <p className="text-gray-600">Connecté en tant que <strong>{user.username}</strong></p>
                            </div>
                            <div className="flex gap-3">
                                {!showForm && !showPasswordForm && !showSocialForm && (
                                    <>
                                        <button
                                            onClick={() => {
                                                setEditingProject(null);
                                                setShowForm(true);
                                            }}
                                            className="px-6 py-3 text-lg font-semibold text-white transition-colors bg-green-600 rounded-lg shadow-lg hover:bg-green-700"
                                        >
                                            + Nouveau projet
                                        </button>
                                        <button
                                            onClick={() => setShowSocialForm(true)}
                                            className="px-6 py-3 text-lg font-semibold text-gray-700 transition-colors border-2 border-gray-300 rounded-lg hover:bg-gray-50"
                                        >
                                            🔗 Réseaux sociaux
                                        </button>
                                        <button
                                            onClick={() => setShowPasswordForm(true)}
                                            className="px-6 py-3 text-lg font-semibold text-gray-700 transition-colors border-2 border-gray-300 rounded-lg hover:bg-gray-50"
                                        >
                                            Changer le mot de passe
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="px-6 py-3 text-lg font-semibold text-red-600 transition-colors border-2 border-red-300 rounded-lg hover:bg-red-50"
                                        >
                                            Déconnexion
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="px-4 py-3 mb-6 text-sm font-medium text-red-800 border border-red-200 rounded-lg bg-red-50">
                            {error}
                        </div>
                    )}

                    {showSocialForm ? (
                        <div className="p-8 bg-white border border-gray-200 shadow-lg rounded-2xl">
                            <h2 className="mb-6 text-2xl font-bold text-gray-900">
                                Gérer les réseaux sociaux
                            </h2>
                            <SocialLinksForm
                                onSuccess={() => {
                                    setShowSocialForm(false);
                                    alert('Liens des réseaux sociaux mis à jour !');
                                }}
                                onCancel={() => setShowSocialForm(false)}
                            />
                        </div>
                    ) : showPasswordForm ? (
                        <div className="p-8 bg-white border border-gray-200 shadow-lg rounded-2xl">
                            <h2 className="mb-6 text-2xl font-bold text-gray-900">
                                Changer le mot de passe
                            </h2>
                            <ChangePasswordForm
                                onSuccess={() => {
                                    setShowPasswordForm(false);
                                    alert('Mot de passe modifié avec succès !');
                                }}
                                onCancel={() => setShowPasswordForm(false)}
                            />
                        </div>
                    ) : showForm ? (
                        <div className="p-8 bg-white border border-gray-200 shadow-lg rounded-2xl">
                            <h2 className="mb-6 text-2xl font-bold text-gray-900">
                                {editingProject ? 'Modifier le projet' : 'Nouveau projet'}
                            </h2>
                            <ProjectForm
                                project={editingProject}
                                onSuccess={handleFormSuccess}
                                onCancel={handleFormCancel}
                            />
                        </div>
                    ) : (
                        <>
                            {projects.length === 0 ? (
                                <div className="py-20 text-center bg-gray-50 rounded-2xl">
                                    <div className="mb-4 text-6xl">📋</div>
                                    <p className="mb-4 text-xl text-gray-600">Aucun projet pour le moment.</p>
                                    <button
                                        onClick={() => setShowForm(true)}
                                        className="px-6 py-3 text-lg font-semibold text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
                                    >
                                        Créer votre premier projet
                                    </button>
                                </div>
                            ) : (
                                <div className="overflow-hidden bg-white border border-gray-200 shadow-lg rounded-2xl">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                                                        Titre
                                                    </th>
                                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                                                        Catégorie
                                                    </th>
                                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                                                        Description
                                                    </th>
                                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                                                        Date
                                                    </th>
                                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-right text-gray-700 uppercase">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {projects.map((project) => (
                                                    <tr key={project.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-semibold text-gray-900">
                                                                {project.title}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="inline-flex px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                                                                {project.category}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="max-w-md text-sm text-gray-600 truncate">
                                                                {project.description}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                            {new Date(project.createdAt).toLocaleDateString('fr-FR')}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <button
                                                                    onClick={() => handleEdit(project)}
                                                                    className="px-4 py-2 text-green-600 transition-colors rounded-lg hover:text-green-800 hover:bg-green-50"
                                                                >
                                                                    Modifier
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(project.id)}
                                                                    disabled={deletingId === project.id}
                                                                    className="px-4 py-2 text-red-600 transition-colors rounded-lg hover:text-red-800 hover:bg-red-50 disabled:opacity-50"
                                                                >
                                                                    {deletingId === project.id ? 'Suppression...' : 'Supprimer'}
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            <div className="mt-8 text-center">
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-gray-700 transition-colors border-2 border-gray-300 rounded-lg hover:border-green-600 hover:text-green-600"
                                >
                                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Retour au site
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
