# JammShop - Site de Dropshipping

JammShop est une plateforme de dropshipping complète construite avec Next.js, Tailwind CSS et Supabase.

## Fonctionnalités

- 🛍️ Catalogue de produits avec filtres et recherche
- 🔍 Pages détaillées de produits
- 🛒 Panier d'achat
- 💳 Processus de paiement
- 👤 Espace client
- 📊 Tableau de bord administrateur
- 📱 Design responsive
- 🔒 Authentification sécurisée
- 📦 Gestion des commandes
- 📈 Statistiques de vente

## Prérequis

- Node.js 18.0.0 ou version ultérieure
- Compte Supabase (pour la base de données et l'authentification)

## Installation

1. Clonez le dépôt :

\`\`\`bash
git clone https://github.com/votre-utilisateur/jammshop.git
cd jammshop
\`\`\`

2. Installez les dépendances :

\`\`\`bash
npm install
\`\`\`

3. Configurez les variables d'environnement :

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=votre-url-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon-supabase
SERVICE_ROLE_KEY=votre-clé-service-role-supabase
\`\`\`

4. Initialisez la base de données Supabase :

- Créez un nouveau projet sur [Supabase](https://supabase.com)
- Exécutez les scripts SQL fournis dans le dossier `database` pour créer les tables nécessaires

5. Lancez le serveur de développement :

\`\`\`bash
npm run dev
\`\`\`

6. Accédez à l'application à l'adresse [http://localhost:3000](http://localhost:3000)

## Structure du projet

\`\`\`
djigaflow/
├── app/                  # Pages et routes de l'application
│   ├── admin/            # Interface d'administration
│   ├── catalogue/        # Catalogue de produits
│   ├── compte/           # Espace client
│   ├── panier/           # Panier d'achat
│   ├── paiement/         # Processus de paiement
│   └── produit/          # Pages de détail produit
├── components/           # Composants réutilisables
├── lib/                  # Utilitaires et fonctions
├── public/               # Fichiers statiques
└── database/             # Scripts SQL pour Supabase
\`\`\`

## Déploiement

### Déploiement sur Vercel

1. Créez un compte sur [Vercel](https://vercel.com) si vous n'en avez pas déjà un
2. Importez votre projet depuis GitHub
3. Configurez les variables d'environnement dans les paramètres du projet
4. Déployez l'application

### Configuration CI/CD

Pour configurer un pipeline CI/CD avec GitHub Actions :

1. Créez un fichier `.github/workflows/ci.yml` avec le contenu suivant :

\`\`\`yaml
name: CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run linting
        run: npm run lint
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build
\`\`\`

## Tâches automatisées

Le projet inclut plusieurs tâches automatisées pour la gestion du site :

- Synchronisation des stocks avec les fournisseurs
- Envoi d'emails automatiques (confirmation de commande, abandon de panier)
- Mise à jour des prix

Pour configurer ces tâches, utilisez un service comme Vercel Cron Jobs ou configurez des webhooks.

## Personnalisation

### Thème et design

Le design utilise Tailwind CSS et peut être personnalisé en modifiant le fichier `tailwind.config.js`.

### Ajout de nouveaux fournisseurs

Pour ajouter de nouveaux fournisseurs, modifiez les fonctions dans `lib/tasks.ts` pour intégrer leurs API.

## Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.
\`\`\`

## 7. Script SQL pour initialiser la base de données

Créons un script SQL pour initialiser la base de données Supabase :
