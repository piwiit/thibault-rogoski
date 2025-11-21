"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Vérifier si déjà connecté
        fetch('/api/auth/me')
            .then(res => {
                if (res.ok) {
                    router.push('/admin');
                }
            })
            .catch(() => {
                // Pas connecté, continuer
            });
    }, [router]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Erreur de connexion');
            }

            router.push('/admin');
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
                            Connexion Admin
                        </h1>
                        <p className="mb-8 text-center text-gray-600">
                            Accédez à l&apos;interface d&apos;administration
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="username" className="block mb-2 text-sm font-semibold text-gray-700">
                                    Nom d&apos;utilisateur
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 text-gray-900 border-2 border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="admin"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-semibold text-gray-700">
                                    Mot de passe
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 text-gray-900 border-2 border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="••••••••"
                                />
                            </div>

                            {error && (
                                <div className="px-4 py-3 text-sm font-medium text-red-800 border border-red-200 rounded-lg bg-red-50">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-6 py-3 text-lg font-semibold text-white transition-all duration-300 bg-green-600 rounded-lg shadow-lg hover:bg-green-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Connexion...
                                    </span>
                                ) : (
                                    'Se connecter'
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <a
                                href="/forgot-password"
                                className="text-sm font-medium text-green-600 hover:text-green-700"
                            >
                                Mot de passe oublié ?
                            </a>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

