"use client";
import { useState } from 'react';

interface UpdateEmailFormProps {
    initialEmail: string;
    onSuccess: (newEmail: string) => void;
    onCancel: () => void;
}

export default function UpdateEmailForm({ initialEmail, onSuccess, onCancel }: UpdateEmailFormProps) {
    const [email, setEmail] = useState(initialEmail);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await fetch('/api/auth/me/email', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Erreur lors de la mise à jour');
            }

            setSuccess('Email mis à jour avec succès !');
            setTimeout(() => {
                onSuccess(email);
            }, 1500);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="email" className="block mb-2 text-sm font-semibold text-gray-700">
                    Nouvelle adresse email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 text-gray-900 border-2 border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="votre@email.com"
                />
            </div>

            {error && (
                <div className="px-4 py-3 text-sm font-medium text-red-800 border border-red-200 rounded-lg bg-red-50">
                    {error}
                </div>
            )}

            {success && (
                <div className="px-4 py-3 text-sm font-medium text-green-800 border border-green-200 rounded-lg bg-green-50">
                    {success}
                </div>
            )}

            <div className="flex gap-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 text-lg font-semibold text-white transition-all duration-300 bg-green-600 rounded-lg shadow-lg hover:bg-green-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Mise à jour...' : 'Mettre à jour l\'email'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="flex-1 px-6 py-3 text-lg font-semibold text-gray-700 transition-all duration-300 border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                    Annuler
                </button>
            </div>
        </form>
    );
}
