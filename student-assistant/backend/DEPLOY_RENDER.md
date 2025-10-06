# Déployer le backend sur Render

## Prérequis

- Compte Render (https://render.com)
- Repo GitHub du projet

## Étapes

1. **Préparer le projet**

   - Vérifie que le dossier `backend/` contient :
     - `server.js`, `package.json`, tous les dossiers nécessaires
     - Un fichier `.env.example` (copie en `.env` sur Render)

2. **Créer un nouveau service Web sur Render**

   - Connecte ton repo GitHub
   - Choisis le dossier `backend/` comme racine
   - Type : Web Service
   - Build Command : `npm install`
   - Start Command : `npm start`

3. **Configurer les variables d’environnement**

   - JWT_SECRET : ton secret JWT
   - DATABASE_URL : `./database.sqlite`
   - CLIENT_URL : URL de ton frontend Vercel (ex : `https://ton-frontend.vercel.app`)

4. **Déploiement automatique**

   - Render installe les dépendances et démarre le serveur
   - La base SQLite est créée automatiquement si absente

5. **Vérifier l’API**
   - L’URL Render fournie (ex : `https://ton-backend.onrender.com`) doit répondre sur `/api/*`
   - Tester avec Postman ou le frontend

## Conseils

- Pour les migrations, Render conserve le fichier `database.sqlite` entre les builds
- Pour la production, sécurise bien le JWT_SECRET
- Pour le frontend, configure `REACT_APP_API_URL` avec l’URL Render

## Liens utiles

- [Render Docs](https://render.com/docs)
- [Render Node.js Guide](https://render.com/docs/deploy-nodejs)

---

**Déploiement frontend sur Vercel** :

- Dossier à déployer : `/frontend`
- Script de build : `npm run build`
- Variable d’environnement : `REACT_APP_API_URL=https://ton-backend.onrender.com`
