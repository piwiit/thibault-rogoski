# 🏗️ Thibault Landing - Site Vitrine Artisan BTP

Landing page moderne pour un artisan spécialisé en terrassement, VRD (Voirie et Réseaux Divers) et entretien paysager. Développée avec Next.js 15, TypeScript, Tailwind CSS et Prisma.

## 📋 Description du projet

Site vitrine professionnel permettant de :
- Présenter les services de l'artisan (Terrassement, VRD, Entretien paysager)
- Afficher les projets réalisés (stockage en base de données PostgreSQL)
- Gérer les demandes de contact via formulaire
- Architecture extensible pour futures intégrations (réseaux sociaux, back-office)

## 🛠️ Stack technique

| Domaine | Technologie |
|---------|-------------|
| **Frontend** | Next.js 15 (App Router) + TypeScript |
| **Design** | Tailwind CSS + Framer Motion |
| **Backend** | API Routes Next.js |
| **Base de données** | PostgreSQL via Prisma ORM |
| **Validation** | Zod |
| **Déploiement** | Vercel |

## 📁 Structure du projet

```
thibault-landing/
├── app/
│   ├── api/
│   │   ├── contact/
│   │   │   └── route.ts          # API POST pour enregistrer les contacts
│   │   └── projects/
│   │       └── route.ts          # API GET pour récupérer les projets
│   ├── contact/
│   │   └── page.tsx               # Page de contact
│   ├── projets/
│   │   └── page.tsx               # Page listant les projets
│   ├── page.tsx                  # Page d'accueil
│   ├── layout.tsx                # Layout principal avec metadata SEO
│   └── globals.css               # Styles globaux
├── components/
│   ├── Hero.tsx                  # Section hero avec animations
│   ├── Section.tsx               # Composant de section réutilisable
│   ├── SectionContent.tsx        # Contenu des sections de services
│   ├── Navbar.tsx                # Barre de navigation
│   ├── Footer.tsx                # Pied de page
│   ├── ProjectCard.tsx           # Carte de projet avec animations
│   └── ContactForm.tsx           # Formulaire de contact
├── lib/
│   └── prisma.ts                 # Singleton PrismaClient
├── prisma/
│   └── schema.prisma             # Schéma de base de données
├── public/
│   └── images/                   # Images des projets
├── .env.example                  # Template de variables d'environnement
├── .prettierrc                   # Configuration Prettier
├── tailwind.config.ts            # Configuration Tailwind CSS
├── tsconfig.json                 # Configuration TypeScript
├── package.json                  # Dépendances et scripts
└── README.md                     # Documentation du projet
```


## 📄 Licence

Projet privé - Tous droits réservés

## 👤 Contact

Pour toute question sur le projet, consulter `PROJECT_CONTEXT.md` pour plus de détails.

---

Développé avec ❤️ en utilisant Next.js 15 et TypeScript
