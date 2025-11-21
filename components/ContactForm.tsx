"use client";
import { useState } from "react";

interface ContactFormProps {
  onSubmit?: (data: { name: string; email: string; message: string }) => void;
}

export default function ContactForm({ onSubmit }: ContactFormProps) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (onSubmit) onSubmit(form);
      // Appel API (optionnel)
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Erreur lors de l'envoi");
      setSent(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Erreur inconnue");
      } else {
        setError("Erreur inconnue");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="flex flex-col w-full max-w-2xl gap-6 p-8 mx-auto bg-white border border-gray-200 shadow-lg rounded-2xl"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="font-semibold text-gray-700">Nom</label>
        <input
          className="w-full px-4 py-3 text-gray-900 transition border-2 border-gray-300 rounded-lg bg-gray-50 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          type="text"
          name="name"
          id="name"
          placeholder="Votre nom"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="font-semibold text-gray-700">Email</label>
        <input
          className="w-full px-4 py-3 text-gray-900 transition border-2 border-gray-300 rounded-lg bg-gray-50 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          type="email"
          name="email"
          id="email"
          placeholder="Votre email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="font-semibold text-gray-700">Message</label>
        <textarea
          className="w-full px-4 py-3 text-gray-900 transition border-2 border-gray-300 rounded-lg resize-none bg-gray-50 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          name="message"
          id="message"
          placeholder="Décrivez votre projet..."
          value={form.message}
          onChange={handleChange}
          required
          rows={6}
        />
      </div>
      {error && (
        <div className="px-4 py-3 text-sm font-medium text-red-800 border border-red-200 rounded-lg bg-red-50">
          {error}
        </div>
      )}
      {sent && (
        <div className="px-4 py-3 text-sm font-medium text-green-800 border border-green-200 rounded-lg bg-green-50">
          ✓ Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
        </div>
      )}
      <button
        type="submit"
        className="px-8 py-4 text-lg font-semibold text-white transition-all duration-300 bg-green-600 rounded-lg shadow-lg hover:bg-green-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Envoi en cours...
          </span>
        ) : (
          "Envoyer le message"
        )}
      </button>
    </form>
  );
}
