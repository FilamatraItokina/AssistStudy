# Backend – Student Assistant

Backend Node.js + Express + SQLite pour l’application d’assistance aux étudiants.

## Démarrage

```bash
npm install
npm run dev
```

## Déploiement

- Script de démarrage : `npm start`
- Variables d’environnement à définir :
  - JWT_SECRET
  - DATABASE_URL=./database.sqlite
  - CLIENT_URL=https://ton-frontend.vercel.app

## Structure

- Architecture MVC
- API REST
- Authentification JWT + bcrypt
- Sauvegarde locale SQLite
