"use client";
import { useState } from 'react';

interface ChangePasswordFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export default function ChangePasswordForm({ onSuccess, onCancel }: ChangePasswordFormProps) {
    const [form, setForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (form.newPassword !== form.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            setLoading(false);
            return;
        }

        if (form.newPassword.length < 6) {
            setError('Le nouveau mot de passe doit contenir au moins 6 caractères');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: form.currentPassword,
                    newPassword: form.newPassword,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Erreur lors du changement de mot de passe');
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
                <label htmlFor="currentPassword" className="block mb-2 text-sm font-semibold text-gray-700">
                    Mot de passe actuel *
                </label>
                <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={form.currentPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 text-gray-900 border-2 border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
            </div>

            <div>
                <label htmlFor="newPassword" className="block mb-2 text-sm font-semibold text-gray-700">
                    Nouveau mot de passe *
                </label>
                <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 text-gray-900 border-2 border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Au moins 6 caractères"
                />
            </div>

            <div>
                <label htmlFor="confirmPassword" className="block mb-2 text-sm font-semibold text-gray-700">
                    Confirmer le nouveau mot de passe *
                </label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 text-gray-900 border-2 border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
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
                    {loading ? 'Modification...' : 'Modifier le mot de passe'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 text-lg font-semibold text-gray-700 transition-colors border-2 border-gray-300 rounded-lg hover:bg-gray-50"
                >
                    Annuler
                </button>
            </div>
        </form>
    );
}

