"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState<'request' | 'reset'>('request');
    const [username, setUsername] = useState('');
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [resetToken, setResetToken] = useState<string | null>(null);

    async function handleRequestReset(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Erreur lors de la demande de réinitialisation');
            }

            // En développement, on affiche le token
            if (data.token) {
                setResetToken(data.token);
                setSuccess('Token de réinitialisation généré. Utilisez-le pour réinitialiser votre mot de passe.');
                setStep('reset');
            } else {
                setSuccess('Si cet utilisateur existe, un email de réinitialisation sera envoyé.');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    }

    async function handleResetPassword(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Erreur lors de la réinitialisation');
            }

            setSuccess('Mot de passe réinitialisé avec succès ! Redirection vers la page de connexion...');
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="flex items-center justify-center min-h-[80vh] pt-24 pb-20">
                <div className="w-full max-w-md px-4">
                    <div className="p-8 bg-white border border-gray-200 shadow-lg rounded-2xl">
                        <h1 className="mb-2 text-3xl font-bold text-center text-gray-900">
                            Mot de passe oublié
                        </h1>

                        {step === 'request' ? (
                            <>
                                <p className="mb-8 text-center text-gray-600">
                                    Entrez votre nom d&apos;utilisateur pour recevoir un lien de réinitialisation
                                </p>

                                <form onSubmit={handleRequestReset} className="space-y-6">
                                    <div>
                                        <label htmlFor="username" className="block mb-2 text-sm font-semibold text-gray-700">
                                            Nom d&apos;utilisateur
                                        </label>
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 text-gray-900 border-2 border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            placeholder="admin"
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

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full px-6 py-3 text-lg font-semibold text-white transition-all duration-300 bg-green-600 rounded-lg shadow-lg hover:bg-green-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Envoi...' : 'Demander la réinitialisation'}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <>
                                <p className="mb-8 text-center text-gray-600">
                                    Entrez le token de réinitialisation et votre nouveau mot de passe
                                </p>

                                {resetToken && (
                                    <div className="p-4 mb-4 border border-yellow-200 rounded-lg bg-yellow-50">
                                        <p className="mb-2 text-sm font-semibold text-yellow-800">
                                            ⚠️ Mode développement - Token :
                                        </p>
                                        <code className="text-xs text-yellow-900 break-all">{resetToken}</code>
                                    </div>
                                )}

                                <form onSubmit={handleResetPassword} className="space-y-6">
                                    <div>
                                        <label htmlFor="token" className="block mb-2 text-sm font-semibold text-gray-700">
                                            Token de réinitialisation
                                        </label>
                                        <input
                                            type="text"
                                            id="token"
                                            name="token"
                                            value={token}
                                            onChange={(e) => setToken(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 text-gray-900 border-2 border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            placeholder="Collez le token ici"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="newPassword" className="block mb-2 text-sm font-semibold text-gray-700">
                                            Nouveau mot de passe
                                        </label>
                                        <input
                                            type="password"
                                            id="newPassword"
                                            name="newPassword"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                            minLength={6}
                                            className="w-full px-4 py-3 text-gray-900 border-2 border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            placeholder="Au moins 6 caractères"
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

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full px-6 py-3 text-lg font-semibold text-white transition-all duration-300 bg-green-600 rounded-lg shadow-lg hover:bg-green-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
                                    </button>
                                </form>
                            </>
                        )}

                        <div className="mt-6 text-center">
                            <Link
                                href="/login"
                                className="text-sm font-medium text-green-600 hover:text-green-700"
                            >
                                ← Retour à la connexion
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

