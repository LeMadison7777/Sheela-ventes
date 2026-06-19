# Sheela — Ventes groupées mode & beauté

Plateforme complète pour les créatrices qui organisent des **ventes groupées** (vêtements, accessoires, parfums, chaussures, ongles).

## Fonctionnalités

- **Landing page** avec scène 3D (Three.js / React Three Fiber) et animations Framer Motion
- **Catalogue** filtrable par catégorie et recherche
- **Groupes de vente** — création, suivi des membres, barre de progression
- **Commandes groupées** — formulaire de participation avec tailles/couleurs
- **Dashboard vendeuse** — stats, groupes récents, commandes
- **Authentification** — inscription / connexion avec sessions sécurisées
- **API REST** complète (Next.js App Router + Prisma + SQLite)

## Démarrage rapide

```bash
cd sheela-ventes
npm install
npm run db:setup    # migration + données demo
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

### Compte démo

- **Email :** `demo@sheela.fr`
- **Mot de passe :** `demo123`

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | Next.js 16, React 19, Tailwind CSS 4 |
| Animations | Framer Motion |
| 3D | Three.js, @react-three/fiber, @react-three/drei |
| Backend | Next.js API Routes |
| Base de données | SQLite + Prisma 7 |
| Auth | bcryptjs + cookies httpOnly |
| Validation | Zod |

## Pages

| Route | Description |
|-------|-------------|
| `/` | Accueil avec hero 3D |
| `/catalogue` | Catalogue produits |
| `/groupes` | Liste des groupes actifs |
| `/groupes/[id]` | Détail + rejoindre un groupe |
| `/groupes/creer` | Créer un nouveau groupe |
| `/dashboard` | Espace vendeuse |
| `/connexion` | Connexion |
| `/inscription` | Inscription |

## Scripts

```bash
npm run dev        # Serveur de développement
npm run build      # Build production
npm run db:migrate # Appliquer migrations
npm run db:seed    # Recharger les données demo
```
