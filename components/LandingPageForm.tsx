'use client';

import { useEffect, useState } from 'react';
import {
  defaultLandingContent,
  type LandingContent,
  type ServiceItem,
} from '@/lib/landing';

interface LandingPageFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

type Tab = 'hero' | 'services' | 'cta' | 'footer' | 'social';

const tabs: { id: Tab; label: string }[] = [
  { id: 'hero', label: 'Hero' },
  { id: 'services', label: 'Prestations' },
  { id: 'cta', label: 'Appel à l\'action' },
  { id: 'footer', label: 'Footer & Contact' },
  { id: 'social', label: 'Réseaux sociaux' },
];

const inputClass =
  'w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent';
const labelClass = 'block mb-2 text-sm font-semibold text-gray-700';

export default function LandingPageForm({ onSuccess, onCancel }: LandingPageFormProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('hero');
  const [content, setContent] = useState<LandingContent>(defaultLandingContent);

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch('/api/settings/landing');
        if (res.ok) {
          const data = await res.json();
          setContent(data);
        }
      } catch (err) {
        console.error('Erreur chargement landing:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, []);

  function updatePath<K extends keyof LandingContent>(
    section: K,
    field: keyof LandingContent[K],
    value: LandingContent[K][keyof LandingContent[K]]
  ) {
    setContent((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  }

  function updateHighlight(index: number, field: 'title' | 'subtitle', value: string) {
    setContent((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        highlights: prev.hero.highlights.map((h, i) =>
          i === index ? { ...h, [field]: value } : h
        ),
      },
    }));
  }

  function updateService(index: number, field: keyof ServiceItem, value: string | string[]) {
    setContent((prev) => ({
      ...prev,
      services: {
        ...prev.services,
        items: prev.services.items.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ),
      },
    }));
  }

  function updateServiceBullet(serviceIndex: number, bulletIndex: number, value: string) {
    setContent((prev) => ({
      ...prev,
      services: {
        ...prev.services,
        items: prev.services.items.map((item, i) => {
          if (i !== serviceIndex) return item;
          const items = [...item.items];
          items[bulletIndex] = value;
          return { ...item, items };
        }),
      },
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/settings/landing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur lors de la sauvegarde');
      }

      onSuccess();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="inline-block w-8 h-8 mb-3 border-b-2 border-green-600 rounded-full animate-spin" />
        <p className="text-gray-600">Chargement...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-wrap gap-2 pb-4 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === tab.id
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'hero' && (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Badge</label>
              <input
                className={inputClass}
                value={content.hero.badge}
                onChange={(e) => updatePath('hero', 'badge', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Initiales (navbar)</label>
              <input
                className={inputClass}
                value={content.site.brandInitials}
                onChange={(e) => updatePath('site', 'brandInitials', e.target.value)}
                maxLength={4}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Nom de marque</label>
            <input
              className={inputClass}
              value={content.site.brandName}
              onChange={(e) => updatePath('site', 'brandName', e.target.value)}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Titre ligne 1</label>
              <input
                className={inputClass}
                value={content.hero.titleLine1}
                onChange={(e) => updatePath('hero', 'titleLine1', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Titre ligne 2 (accent)</label>
              <input
                className={inputClass}
                value={content.hero.titleLine2}
                onChange={(e) => updatePath('hero', 'titleLine2', e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Sous-titre</label>
            <textarea
              className={inputClass}
              rows={3}
              value={content.hero.subtitle}
              onChange={(e) => updatePath('hero', 'subtitle', e.target.value)}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Bouton principal</label>
              <input
                className={inputClass}
                value={content.hero.ctaPrimary}
                onChange={(e) => updatePath('hero', 'ctaPrimary', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Bouton secondaire</label>
              <input
                className={inputClass}
                value={content.hero.ctaSecondary}
                onChange={(e) => updatePath('hero', 'ctaSecondary', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-sm font-semibold text-gray-700">Points forts (3)</p>
            {content.hero.highlights.map((highlight, index) => (
              <div key={index} className="grid gap-3 rounded-lg border border-gray-200 p-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Titre {index + 1}</label>
                  <input
                    className={inputClass}
                    value={highlight.title}
                    onChange={(e) => updateHighlight(index, 'title', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Sous-titre {index + 1}</label>
                  <input
                    className={inputClass}
                    value={highlight.subtitle}
                    onChange={(e) => updateHighlight(index, 'subtitle', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'services' && (
        <div className="space-y-6">
          <div>
            <label className={labelClass}>Titre de section</label>
            <input
              className={inputClass}
              value={content.services.title}
              onChange={(e) => updatePath('services', 'title', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Sous-titre</label>
            <textarea
              className={inputClass}
              rows={2}
              value={content.services.subtitle}
              onChange={(e) => updatePath('services', 'subtitle', e.target.value)}
            />
          </div>
          {content.services.items.map((service, index) => (
            <div key={index} className="space-y-4 rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900">Prestation {index + 1}</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className={labelClass}>Titre</label>
                  <input
                    className={inputClass}
                    value={service.title}
                    onChange={(e) => updateService(index, 'title', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Icône (emoji)</label>
                  <input
                    className={inputClass}
                    value={service.icon}
                    onChange={(e) => updateService(index, 'icon', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Couleur (classes Tailwind)</label>
                  <input
                    className={inputClass}
                    value={service.color}
                    onChange={(e) => updateService(index, 'color', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <input
                  className={inputClass}
                  value={service.description}
                  onChange={(e) => updateService(index, 'description', e.target.value)}
                />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {service.items.map((item, bulletIndex) => (
                  <div key={bulletIndex}>
                    <label className={labelClass}>Point {bulletIndex + 1}</label>
                    <input
                      className={inputClass}
                      value={item}
                      onChange={(e) => updateServiceBullet(index, bulletIndex, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'cta' && (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Titre</label>
            <input
              className={inputClass}
              value={content.cta.title}
              onChange={(e) => updatePath('cta', 'title', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Sous-titre</label>
            <textarea
              className={inputClass}
              rows={2}
              value={content.cta.subtitle}
              onChange={(e) => updatePath('cta', 'subtitle', e.target.value)}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Bouton principal</label>
              <input
                className={inputClass}
                value={content.cta.buttonPrimary}
                onChange={(e) => updatePath('cta', 'buttonPrimary', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Bouton secondaire</label>
              <input
                className={inputClass}
                value={content.cta.buttonSecondary}
                onChange={(e) => updatePath('cta', 'buttonSecondary', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'footer' && (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Texte à propos</label>
            <textarea
              className={inputClass}
              rows={3}
              value={content.footer.about}
              onChange={(e) => updatePath('footer', 'about', e.target.value)}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Téléphone</label>
              <input
                className={inputClass}
                value={content.footer.phone}
                onChange={(e) => updatePath('footer', 'phone', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                className={inputClass}
                value={content.footer.email}
                onChange={(e) => updatePath('footer', 'email', e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Texte copyright</label>
            <input
              className={inputClass}
              value={content.footer.copyright}
              onChange={(e) => updatePath('footer', 'copyright', e.target.value)}
            />
          </div>
        </div>
      )}

      {activeTab === 'social' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Laissez un champ vide pour masquer le réseau social correspondant.
          </p>
          {(['facebook', 'instagram', 'linkedin'] as const).map((network) => (
            <div key={network}>
              <label className={`${labelClass} capitalize`}>{network}</label>
              <input
                type="url"
                className={inputClass}
                value={content.social[network]}
                onChange={(e) => updatePath('social', network, e.target.value)}
                placeholder={`https://${network}.com/...`}
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-4 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 rounded-lg bg-green-600 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? 'Sauvegarde...' : 'Enregistrer la page d\'accueil'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="flex-1 rounded-lg border-2 border-gray-300 px-6 py-3 text-lg font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
