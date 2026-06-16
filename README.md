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

## 🚀 Installation et setup

### Prérequis

- Node.js 18+ et npm
- PostgreSQL (local ou via Docker)
- Git

### Étapes d'installation

1. **Cloner le projet** (si applicable)
   ```bash
   git clone <repository-url>
   cd thibault-landing
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer la base de données**

   Créer un fichier `.env` à la racine du projet (ou copier `.env.example`) :
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/thibault_landing?schema=public"
   DIRECT_URL="postgresql://user:password@host:5432/thibault_landing"
   ADMIN_USER="admin"
   ADMIN_PASSWORD="#################"
   ```

   > `ADMIN_PASSWORD` doit contenir au moins 12 caractères, avec majuscules, minuscules, chiffres et caractères spéciaux. Ces identifiants ne sont utilisés que pour provisionner un compte admin en développement.

4. **Initialiser Prisma et créer les tables**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

6. **Ouvrir dans le navigateur**

   Accéder à [http://localhost:3000](http://localhost:3000)

## 📝 Commandes disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance le serveur de développement avec Turbopack |
| `npm run build` | Compile l'application pour la production |
| `npm run start` | Lance le serveur de production |
| `npm run lint` | Vérifie le code avec ESLint |
| `npx prisma studio` | Ouvre l'interface Prisma Studio pour gérer la base de données |
| `npx prisma migrate dev` | Crée une nouvelle migration |
| `npx prisma generate` | Régénère le client Prisma |
| `npm run db:init-admin` | Crée l’utilisateur admin (développement uniquement) |

## 🗄️ Base de données

### Modèles Prisma

**Project**
- `id` : Identifiant unique (auto-incrémenté)
- `title` : Titre du projet
- `category` : Catégorie (Terrassement, VRD, Entretien paysager)
- `description` : Description du projet
- `imageUrl` : URL de l'image (optionnel)
- `createdAt` : Date de création

**Contact**
- `id` : Identifiant unique (auto-incrémenté)
- `name` : Nom du contact
- `email` : Email du contact
- `message` : Message du contact
- `createdAt` : Date de création

### Gestion de la base de données

- **Provision initial dev** : `npx prisma migrate dev --name init`
- **Déploiement prod** : `npx prisma migrate deploy`
- **Création admin (dev uniquement)** :
  ```bash
  npm run db:init-admin
  ```
  Le script lit `ADMIN_USER/ADMIN_PASSWORD`, vérifie la complexité du mot de passe et refuse de s’exécuter si `NODE_ENV` vaut `production`.
- **Endpoint d’init** : `POST /api/auth/init` déclenche la même logique mais renvoie `403` en production.
- **Visualisation** :
  ```bash
  npx prisma studio
  ```

## 🔌 API Routes

### POST `/api/contact`

Enregistre un nouveau message de contact.

**Body (JSON) :**
```json
{
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "message": "Bonjour, je souhaite un devis..."
}
```

**Réponse (200) :**
```json
{
  "success": true,
  "contact": { ... }
}
```

### GET `/api/projects`

Récupère la liste de tous les projets, triés par date de création (plus récents en premier).

**Réponse (200) :**
```json
[
  {
    "id": 1,
    "title": "Terrassement piscine",
    "category": "Terrassement",
    "description": "...",
    "imageUrl": "...",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  ...
]
```

## 🎨 Personnalisation

### Couleurs (Tailwind)

Les couleurs sont définies dans `tailwind.config.ts` :
- **Primary** : `#FFD33A` (jaune doré)
- **Neutral** : Tons de gris/noir pour les fonds
- **Success/Warning/Error** : Couleurs fonctionnelles

### Animations

Les animations Framer Motion sont configurées dans :
- `components/Hero.tsx` : Animation d'apparition du titre et CTA
- `components/Section.tsx` : Animation au scroll
- `components/ProjectCard.tsx` : Animation au hover et au scroll
- `app/page.tsx` : Animations en cascade des cartes de services

## 🚢 Déploiement

### Vercel (recommandé)

1. **Préparer le build**
   ```bash
   npm run build
   ```

2. **Déployer sur Vercel**
   - Connecter le repository GitHub/GitLab
   - Configurer les variables `DATABASE_URL`, `DIRECT_URL`, `ADMIN_USER`, `ADMIN_PASSWORD`
   - Vercel détectera automatiquement Next.js et déploiera

3. **Post-déploiement**
   - Exécuter les migrations Prisma sur la base de production :
     ```bash
     npx prisma migrate deploy
     ```
   - Ne pas exécuter `npm run db:init-admin` ni appeler `/api/auth/init` en production (ces outils sont désactivés). Créez les comptes administrateurs via un processus interne sécurisé.

## 📚 Workflow de développement

1. **Créer une branche** pour une nouvelle fonctionnalité
2. **Développer** en utilisant le serveur de développement (`npm run dev`)
3. **Tester** les routes API et l'interface
4. **Vérifier le code** avec `npm run lint`
5. **Créer une migration Prisma** si modification du schéma
6. **Commit et push** vers le repository

## 🔮 Évolutions futures

- [ ] Module de prise de rendez-vous (Calendly / Cal.com)
- [ ] Intégration réseaux sociaux (publication auto des projets)
- [ ] Back-office pour gérer projets et contacts
- [ ] Génération automatique de contenu via IA
- [ ] Galerie d'images améliorée
- [ ] Blog/Actualités

## 📄 Licence

Projet privé - Tous droits réservés

## 👤 Contact

Pour toute question sur le projet, consulter `PROJECT_CONTEXT.md` pour plus de détails.

---

Développé avec ❤️ en utilisant Next.js 15 et TypeScript
