# TrustID Web

Application frontend React pour la signature électronique de documents.

## Démarrage

### Prérequis
- Node.js (v14 ou supérieur)
- npm ou yarn

### Installation
```bash
npm install
```

### Scripts disponibles

#### `npm start`
Lance l'application en mode développement.
Ouvrez [http://localhost:3000](http://localhost:3000) pour voir l'application dans votre navigateur.

#### `npm run build`
Construit l'application pour la production dans le dossier `build`.
Les fichiers sont minifiés et prêts pour le déploiement.

#### `npm test`
Lance les tests en mode watch.

## Déploiement sur Vercel

Ce projet est configuré pour être déployé sur [Vercel](https://vercel.com).

### Configuration automatique
Le fichier `vercel.json` est déjà configuré avec :
- Build automatique via `@vercel/static-build`
- Support du routing côté client (SPA)
- Redirection vers `index.html` pour toutes les routes

### Déploiement manuel

1. **Poussez votre code sur GitHub**
   ```bash
   git add .
   git commit -m "Préparation pour Vercel"
   git push origin main
   ```

2. **Connectez-vous à Vercel**
   - Allez sur [vercel.com](https://vercel.com)
   - Connectez-vous avec votre compte GitHub
   - Cliquez sur "New Project"
   - Importez votre repository `trustid-web`

3. **Configurez les variables d'environnement**
   Dans les paramètres du projet Vercel, ajoutez :
   - `REACT_APP_API_URL` : `https://trustid-backend-production.up.railway.app`
   - `REACT_APP_WS_URL` : `wss://trustid-backend-production.up.railway.app`

4. **Déployez**
   Vercel détectera automatiquement que c'est un projet React et configurera le build.

### Variables d'environnement

Le fichier `.env` contient les variables suivantes :
```
REACT_APP_API_URL=https://trustid-backend-production.up.railway.app
REACT_APP_WS_URL=wss://trustid-backend-production.up.railway.app
```

## Architecture

- **React 19** avec React Router v7
- **Google OAuth** pour l'authentification
- **Signature Canvas** pour la signature électronique
- **WebSocket** pour la communication en temps réel

## Pages principales

- `/login` - Authentification
- `/dashboard` - Tableau de bord
- `/upload-sign` - Téléchargement et signature de documents
- `/historique` - Historique des signatures
- `/profil` - Profil utilisateur
- `/statistiques` - Statistiques
- `/sign` - Espace de signature public (via token)
- `/verifier` - Vérification de documents

## Backend

Le backend est hébergé sur Railway : `https://trustid-backend-production.up.railway.app`