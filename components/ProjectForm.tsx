"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Project {
    id?: number;
    title: string;
    category: string;
    description: string;
    imageUrl?: string | null;
}

interface ProjectFormProps {
    project?: Project | null;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function ProjectForm({ project, onSuccess, onCancel }: ProjectFormProps) {
    const [form, setForm] = useState<Project>({
        title: '',
        category: 'Terrassement',
        description: '',
        imageUrl: '',
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (project) {
            setForm({
                title: project.title,
                category: project.category,
                description: project.description,
                imageUrl: project.imageUrl || '',
            });
            if (project.imageUrl) {
                setPreview(project.imageUrl);
            }
        }
    }, [project]);

    async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        // Vérifier le type
        if (!file.type.startsWith('image/')) {
            setError('Veuillez sélectionner un fichier image');
            return;
        }

        // Vérifier la taille (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            setError('Le fichier est trop volumineux (max 5MB)');
            return;
        }

        setUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Erreur lors de l\'upload');
            }

            setForm({ ...form, imageUrl: data.imageUrl });
            setPreview(data.imageUrl);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload');
        } finally {
            setUploading(false);
        }
    }

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const url = project?.id
                ? `/api/projects/${project.id}`
                : '/api/projects';

            const method = project?.id ? 'PUT' : 'POST';

            const payload = {
                title: form.title.trim(),
                category: form.category,
                description: form.description.trim(),
                imageUrl: form.imageUrl && form.imageUrl.trim() !== '' ? form.imageUrl.trim() : null,
            };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                const errorMessage = data.details
                    ? `${data.error}: ${JSON.stringify(data.details)}`
                    : data.error || 'Erreur lors de l\'enregistrement';
                throw new Error(errorMessage);
            }

            onSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                    Titre *
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 text-gray-900 border-2 border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Ex: Terrassement piscine"
                />
            </div>

            <div>
                <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                    Catégorie *
                </label>
                <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 text-gray-900 border-2 border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                    <option value="Terrassement">Terrassement</option>
                    <option value="VRD">VRD</option>
                    <option value="Entretien paysager">Entretien paysager</option>
                </select>
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 text-gray-900 border-2 border-gray-300 rounded-lg resize-none bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Décrivez le projet..."
                />
            </div>

            <div>
                <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-2">
                    Image du projet (optionnel)
                </label>

                <div className="space-y-4">
                    <div>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                            onChange={handleFileUpload}
                            disabled={uploading}
                            className="w-full px-4 py-3 text-gray-900 border-2 border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:opacity-50"
                        />
                        {uploading && (
                            <p className="mt-2 text-sm text-gray-600">Upload en cours...</p>
                        )}
                    </div>

                    {preview && (
                        <div className="relative w-full h-48 border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100">
                            <Image
                                src={preview}
                                alt="Aperçu"
                                fill
                                className="object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setPreview(null);
                                    setForm({ ...form, imageUrl: '' });
                                }}
                                className="absolute top-2 right-2 px-3 py-1 text-sm font-semibold text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
                            >
                                Supprimer
                            </button>
                        </div>
                    )}

                    <div className="text-sm text-gray-500">
                        <p>Ou utilisez une URL :</p>
                        <input
                            type="url"
                            id="imageUrl"
                            name="imageUrl"
                            value={form.imageUrl || ''}
                            onChange={(e) => {
                                setForm({ ...form, imageUrl: e.target.value });
                                if (e.target.value) {
                                    setPreview(e.target.value);
                                }
                            }}
                            className="w-full mt-2 px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>
                </div>
            </div>

            {error && (
                <div className="px-4 py-3 text-sm font-medium text-red-800 border border-red-200 rounded-lg bg-red-50">
                    {error}
                </div>
            )}

            <div className="flex gap-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 text-lg font-semibold text-white transition-all duration-300 bg-green-600 rounded-lg shadow-lg hover:bg-green-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Enregistrement...
                        </span>
                    ) : (
                        project?.id ? 'Modifier le projet' : 'Créer le projet'
                    )}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 text-lg font-semibold text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Annuler
                </button>
            </div>
        </form>
    );
}

