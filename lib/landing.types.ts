export interface ServiceItem {
  title: string;
  icon: string;
  description: string;
  items: string[];
  color: string;
}

export interface LandingContent {
  site: {
    brandName: string;
    brandInitials: string;
    faviconUrl?: string;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    highlights: Array<{ title: string; subtitle: string }>;
  };
  services: {
    title: string;
    subtitle: string;
    items: ServiceItem[];
  };
  cta: {
    title: string;
    subtitle: string;
    buttonPrimary: string;
    buttonSecondary: string;
  };
  footer: {
    about: string;
    phone: string;
    email: string;
    copyright: string;
  };
  social: {
    facebook: string;
    instagram: string;
    linkedin: string;
  };
}

export const defaultLandingContent: LandingContent = {
  site: {
    brandName: 'Thibault Rogoski',
    brandInitials: 'TR',
  },
  hero: {
    badge: 'Artisan Professionnel',
    titleLine1: 'Terrassement, VRD',
    titleLine2: 'Entretien Paysager',
    subtitle:
      'Expert en aménagement extérieur, je réalise vos projets de terrassement, VRD et entretien paysager avec professionnalisme et qualité.',
    ctaPrimary: 'Demander un devis gratuit',
    ctaSecondary: 'Voir nos réalisations',
    highlights: [
      { title: 'Intervention rapide', subtitle: 'Sous 48h' },
      { title: 'Devis gratuit', subtitle: 'Sans engagement' },
      { title: 'Qualité garantie', subtitle: '100% satisfait' },
    ],
  },
  services: {
    title: 'Nos Prestations',
    subtitle: "Des services professionnels pour tous vos projets d'aménagement extérieur",
    items: [
      {
        title: 'Terrassement',
        icon: '🚜',
        description: 'Excavation, fondations, préparation de terrain',
        items: ['Excavation', 'Fondation tranchée', 'Béton lavé', 'Nivellement'],
        color: 'from-blue-500 to-blue-600',
      },
      {
        title: 'VRD',
        icon: '🛠️',
        description: 'Voirie et Réseaux Divers',
        items: ['Assainissement', 'Canalisation', 'Réseaux secs', 'Voirie'],
        color: 'from-orange-500 to-orange-600',
      },
      {
        title: 'Entretien Paysager',
        icon: '🌳',
        description: 'Entretien régulier de vos espaces verts',
        items: ['Tonte', 'Taille', 'Désherbage', 'Soins des plantations'],
        color: 'from-green-500 to-green-600',
      },
    ],
  },
  cta: {
    title: 'Prêt à démarrer votre projet ?',
    subtitle: 'Contactez-nous pour un devis gratuit et sans engagement',
    buttonPrimary: 'Demander un devis',
    buttonSecondary: 'Voir nos réalisations',
  },
  footer: {
    about: 'Artisan professionnel spécialisé en terrassement, VRD et entretien paysager.',
    phone: '06.84.23.08.56',
    email: 'thibaultrogoski@hotmail.com',
    copyright: 'Thibault Rogoski - Terrassement, VRD, Entretien Paysager. Tous droits réservés.',
  },
  social: {
    facebook: 'https://www.facebook.com/profile.php?id=61556212468724',
    instagram: '',
    linkedin: '',
  },
};
