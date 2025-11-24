# 🧠 PROJECT_CONTEXT.md
### Projet : Landing Page Thibault + Backend Next.js + IA Assistant (Full Next)

---

## 🎯 Objectif global

Développer une **landing page moderne** pour un artisan Thibault (terrassement, VRD, entretien paysager), avec un **backend intégré** dans Next.js et une **aide IA** pour la génération de contenu et le développement dans VS Code.

L’application devra :
- être rapide, responsive, et SEO-friendly,
- gérer et afficher les **projets effectués** (stockage en base + interface simple),
- être extensible pour de futures intégrations de **réseaux sociaux** (publication auto ou flux d’actualités).

---

## 🏗️ Stack technique

| Domaine | Technologie |
|----------|--------------|
| **Frontend** | Next.js 15 (App Router) + TypeScript |
| **Design** | Tailwind CSS + Framer Motion |
| **Backend** | API Routes Next.js |
| **Base de données** | PostgreSQL via Prisma ORM |
| **Validation** | Zod |
| **Déploiement** | Vercel |
| **IA Dev Assist** | Claude Code (VS Code plugin) |

---

## 🗺️ Roadmap de développement

### **Phase 1 — Setup du projet**

- [ ] Créer le projet :
  ```bash
  npx create-next-app@latest Thibault-landing
  ```
- [ ] Activer TypeScript, Tailwind CSS, ESLint, Prettier
- [ ] Initialiser Prisma :
  ```bash
  npx prisma init
  ```
- [ ] Créer une base PostgreSQL (locale ou Docker)
- [ ] Définir les modèles initiaux :

```prisma
model Project {
  id          Int      @id @default(autoincrement())
  title       String
  category    String
  description String
  imageUrl    String?
  createdAt   DateTime @default(now())
}

model Contact {
  id        Int      @id @default(autoincrement())
  name      String
  email     String
  message   String
  createdAt DateTime @default(now())
}
```

- [ ] Lancer la migration :
  ```bash
  npx prisma migrate dev --name init
  ```

---

### **Phase 2 — UI : Landing Page**

- [ ] Créer la page principale `/app/page.tsx`
  - Présenter Thibault, son activité et ses spécialités
- [ ] Créer la page `/app/contact/page.tsx`
  - Formulaire simple (nom, email, message)
- [ ] Créer la page `/app/projets/page.tsx`
  - Liste dynamique des projets réalisés (rendus depuis Prisma)
- [ ] Composants à générer :
  - [ ] `<Navbar />`
  - [ ] `<Hero />`
  - [ ] `<Section />` (Terrassement, VRD, Entretien paysager)
  - [ ] `<ProjectCard />`
  - [ ] `<ContactForm />`
  - [ ] `<Footer />`
- [ ] Styliser avec Tailwind (mise en page claire, responsive)
- [ ] Ajouter animations à l’apparition (Framer Motion)
- [ ] Intégrer les textes descriptifs et CTA (appel à l’action)

---

### **Phase 3 — Backend / API**

- [ ] Créer les routes API :
  - `/api/contact` → POST, enregistre un message
  - `/api/projects` → GET, retourne la liste des projets
- [ ] Valider les entrées avec **Zod**
- [ ] Utiliser Prisma pour interagir avec la base
- [ ] Tester les endpoints avec `curl` ou Postman
- [ ] Prévoir gestion d’erreurs (status 400 / 500)

---

### **Phase 4 — IA Developer Workflow (Claude Code)**

#### 🎯 Objectif
Utiliser **Claude Code** dans VS Code comme agent IA pour :
- générer les composants React et les routes API,
- automatiser les migrations Prisma,
- corriger ou expliquer le code,
- écrire la documentation.

#### 🧠 Prompts recommandés
- “Crée un composant Section avec titre et liste stylée Tailwind.”
- “Génère la route /api/projects avec Prisma et validation Zod.”
- “Ajoute une page dynamique qui affiche les projets de la table Project.”
- “Optimise la page principale pour le SEO avec les balises nécessaires.”

#### ⚙️ Tâches types
| Tâche | Exemple |
|-------|----------|
| 🧩 Génération de composant | `Hero`, `ProjectCard`, `ContactForm` |
| 🗃️ Création de modèle | Prisma : `Project` et `Contact` |
| 🔌 API Routes | `/api/projects`, `/api/contact` |
| 📘 Documentation | `README.md` + commentaires dans le code |
| 🧠 Refactor / Debug | Nettoyage et vérification de cohérence du code |

---

- [ ] Ajouter le fichier `.env` (copier `.env.example`) :
  ```env
  DATABASE_URL="postgresql://user:password@host:5432/thibault_landing?schema=public"
  DIRECT_URL="postgresql://user:password@host:5432/thibault_landing"
  ADMIN_USER="admin"
  ADMIN_PASSWORD="motDePasseComplexe@2024"
  ```
- `ADMIN_PASSWORD` doit contenir au moins 12 caractères (majuscules/minuscules/chiffres/symbole) et n’est utilisé qu’en développement pour provisionner un compte admin.
- [ ] Vérifier la commande :
  ```bash
  npm run build && npm start
  ```
- [ ] Déployer sur **Vercel**
- [ ] Configurer `DATABASE_URL`, `DIRECT_URL`, `ADMIN_USER`, `ADMIN_PASSWORD` sur Vercel (les deux dernières peuvent rester vides si l’on n’initialise pas d’admin en prod)
- [ ] Initialiser l’admin uniquement en développement via `npm run db:init-admin` ou `POST /api/auth/init` (cet endpoint renvoie 403 en production)
- [ ] Tester les routes `/api/contact` et `/api/projects`
- [ ] Vérifier le rendu responsive et le SEO (Lighthouse 90+)

---

## 🚀 Évolutions futures

| Fonctionnalité | Description |
|-----------------|--------------|
| 🧠 IA Contenu | Génération automatique des textes à partir des catégories |
| 📅 Rendez-vous | Ajout d’un module de prise de rendez-vous (Calendly / Cal.com) |
| 📢 Réseaux sociaux | API connectée pour auto-poster les nouveaux projets |
| 🧩 Back-office | Tableau de bord artisan (gestion projets & contacts) |

---

## ✅ To-Do agent IA (Claude Code)

### Étape 1 – Setup
> Initialise le projet Next.js avec Tailwind, Prisma, ESLint, Prettier, TypeScript.

### Étape 2 – Structure et UI
> Crée les composants de base (`Hero`, `Section`, `Navbar`, `ProjectCard`, `ContactForm`).

### Étape 3 – Backend API
> Crée les routes API pour `/api/contact` et `/api/projects` avec Prisma.

### Étape 4 – Documentation
> Rédige un `README.md` décrivant la structure du projet et le workflow.

### Étape 5 – Déploiement
> Prépare les fichiers d’environnement et configure Vercel.

---

## 📁 Structure cible

```
porfolio/
  thibault-landing/
  ├─ app/
  │  ├─ api/
  │  │  ├─ contact/
  │  │  │  └─ route.ts
  │  │  └─ projects/
  │  │     └─ route.ts
  │  ├─ contact/
  │  │  └─ page.tsx
  │  ├─ projets/
  │  │  └─ page.tsx
  │  ├─ page.tsx
  │  ├─ layout.tsx
  ├─ components/
  │  ├─ Hero.tsx
  │  ├─ Section.tsx
  │  ├─ Navbar.tsx
  │  ├─ Footer.tsx
  │  ├─ ProjectCard.tsx
  │  ├─ ContactForm.tsx
  ├─ prisma/
  │  └─ schema.prisma
  ├─ public/
  │  └─ images/
  ├─ .env
  ├─ package.json
  ├─ tailwind.config.ts
  ├─ tsconfig.json
  ├─ PROJECT_CONTEXT.md
  └─ README.md
```

---

## 💡 Bonnes pratiques IA Dev

- Toujours **fournir ce fichier à l’IA** comme contexte avant chaque série de tâches.
- Donner à l’IA une **intention claire** avant de demander du code (ex. “je veux un composant responsive qui affiche X”).
- Laisser l’IA générer puis **relire et tester** avant commit.
- Garder le code **propre, typé et documenté**.

---

## 👤 Contexte du projet

Projet vitrine pour un **artisan du BTP** (Terrassement, VRD, Entretien paysager).
Développement assisté par **Claude Code** sous Visual Studio Code.
Architecture pensée pour évoluer vers une plateforme connectée (gestion + diffusion).

---
