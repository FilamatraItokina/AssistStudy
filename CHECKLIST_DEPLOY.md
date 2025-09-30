# ✅ Checklist de déploiement

Cochez chaque étape au fur et à mesure !

## 📋 Avant de commencer

- [ ] J'ai un compte GitHub
- [ ] J'ai un compte Render.com (gratuit)
- [ ] Mon application fonctionne en local
- [ ] J'ai testé toutes les fonctionnalités

## 🔧 Préparation du code

- [ ] Exécuter `npm run check-deploy` → Tout est ✅
- [ ] Exécuter `npm run generate-secret` → JWT secret copié
- [ ] Vérifier que `.env` est dans `.gitignore`
- [ ] Vérifier que `data.sqlite` est dans `.gitignore`

## 📤 GitHub

- [ ] Repository créé sur GitHub
- [ ] Code poussé avec `git push`
- [ ] Vérifier que `.env` n'est PAS sur GitHub (important !)
- [ ] Vérifier que tous les fichiers sont bien poussés

## 🚀 Backend sur Render

- [ ] Créer un Web Service
- [ ] Repository connecté
- [ ] Build command: `npm install`
- [ ] Start command: `npm run server`
- [ ] Instance Type: Free

### Variables d'environnement backend:
- [ ] `JWT_SECRET` = [secret généré]
- [ ] `JWT_EXPIRES_IN` = `7d`
- [ ] `NODE_ENV` = `production`

- [ ] Cliquer sur "Create Web Service"
- [ ] Attendre le déploiement (5-10 min)
- [ ] URL backend notée: `https://_____.onrender.com`
- [ ] Tester l'API: ouvrir l'URL dans le navigateur

## 🎨 Frontend sur Render

- [ ] Créer un Static Site
- [ ] Repository connecté
- [ ] Root Directory: `client`
- [ ] Build command: `npm install && npm run build`
- [ ] Publish Directory: `dist`
- [ ] Instance Type: Free

### Variables d'environnement frontend:
- [ ] `VITE_API_URL` = [URL backend notée ci-dessus]

- [ ] Cliquer sur "Create Static Site"
- [ ] Attendre le déploiement (5-10 min)
- [ ] URL frontend notée: `https://_____.onrender.com`

## 🔗 Configuration CORS

- [ ] Ouvrir `server.js` sur GitHub ou localement
- [ ] Ajouter l'URL frontend dans `allowedOrigins`:
  ```javascript
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://votre-app.onrender.com' // ← ICI
  ];
  ```
- [ ] Commiter et pousser
- [ ] Render redéploie automatiquement (2-3 min)

## ✅ Tests

- [ ] Ouvrir l'URL frontend
- [ ] Créer un compte
- [ ] Se connecter
- [ ] Ajouter une tâche
- [ ] Créer un cours
- [ ] Ajouter une note d'examen
- [ ] Vérifier les graphiques
- [ ] Tester le Pomodoro
- [ ] Tester sur mobile (responsive)

## 🐛 En cas de problème

### CORS error
- [ ] Vérifier l'URL dans `allowedOrigins` (server.js)
- [ ] Attendre le redéploiement du backend
- [ ] Rafraîchir le frontend (Ctrl+F5)

### API ne répond pas
- [ ] Vérifier les logs backend sur Render
- [ ] Vérifier `VITE_API_URL` dans les env vars frontend
- [ ] Tester l'API directement dans le navigateur

### Page blanche
- [ ] Ouvrir la console (F12) → onglet Console
- [ ] Vérifier les erreurs
- [ ] Vérifier les logs de build sur Render

### Base de données vide après redéploiement
- [ ] Normal avec SQLite sur Render Free
- [ ] Voir DEPLOYMENT.md pour migrer vers PostgreSQL

## 🎉 Félicitations !

- [ ] Mon app est en ligne !
- [ ] J'ai testé toutes les fonctionnalités
- [ ] J'ai partagé le lien avec des amis
- [ ] J'ai ajouté le lien dans mon CV/portfolio

## 📱 Partager votre app

Votre application est accessible à cette adresse:
```
https://votre-app.onrender.com
```

Partagez-la sur:
- LinkedIn
- GitHub README
- Portfolio personnel
- CV

---

**Besoin d'aide ?** Consultez:
- [DEPLOY_RAPIDE.md](DEPLOY_RAPIDE.md) - Guide rapide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Guide détaillé
- [Render Docs](https://render.com/docs)
