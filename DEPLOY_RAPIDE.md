# 🚀 Guide de déploiement RAPIDE sur Render.com

## ⚡ Version courte (15 minutes)

### 1️⃣ Préparer le code (2 min)

```bash
# Générez un JWT secret sécurisé
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copiez le résultat, vous en aurez besoin !

# Commitez tout
git add .
git commit -m "Ready for deployment"
```

### 2️⃣ Pousser sur GitHub (3 min)

```bash
# Créez un nouveau repo sur github.com
# Puis:
git remote add origin https://github.com/VOTRE_USERNAME/assistant-etudiant.git
git branch -M main
git push -u origin main
```

### 3️⃣ Déployer le BACKEND (5 min)

1. Allez sur [dashboard.render.com](https://dashboard.render.com)
2. Cliquez **New +** → **Web Service**
3. Connectez GitHub et sélectionnez votre repo
4. Configuration:
   - **Name**: `assistant-etudiant-api`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run server`
   - **Instance Type**: Free

5. **Environment Variables** (cliquez "Add Environment Variable"):
   ```
   JWT_SECRET = [votre clé générée à l'étape 1]
   JWT_EXPIRES_IN = 7d
   NODE_ENV = production
   ```

6. Cliquez **Create Web Service**
7. ⏳ Attendez 5-10 min
8. **Notez l'URL** (ex: `https://assistant-etudiant-api.onrender.com`)

### 4️⃣ Déployer le FRONTEND (5 min)

1. Retour sur dashboard → **New +** → **Static Site**
2. Sélectionnez le même repo
3. Configuration:
   - **Name**: `assistant-etudiant-app`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. **Environment Variables**:
   ```
   VITE_API_URL = https://assistant-etudiant-api.onrender.com
   ```
   (Remplacez par l'URL de votre backend de l'étape 3)

5. Cliquez **Create Static Site**
6. ⏳ Attendez 5-10 min

### 5️⃣ Configurer le CORS (2 min)

1. Retournez sur GitHub
2. Éditez `server.js` ligne 27
3. Ajoutez l'URL de votre frontend:
   ```javascript
   const allowedOrigins = [
     'http://localhost:3000',
     'http://localhost:5173',
     'https://assistant-etudiant-app.onrender.com' // ← Ajoutez cette ligne
   ];
   ```

4. Commitez et poussez:
   ```bash
   git add server.js
   git commit -m "Add production CORS origin"
   git push
   ```

Render va automatiquement redéployer le backend ! ✨

### ✅ C'est fait !

Ouvrez votre application: `https://assistant-etudiant-app.onrender.com`

## 🐛 Problèmes courants

### "Not allowed by CORS"
➡️ Vérifiez que vous avez bien ajouté l'URL frontend dans `server.js` (étape 5)

### "API ne répond pas"
➡️ Vérifiez que le backend est bien démarré (vert sur Render dashboard)
➡️ Testez l'API: `https://votre-api.onrender.com/api/auth/me`

### "Le site ne charge pas"
➡️ Vérifiez `VITE_API_URL` dans les env vars du frontend
➡️ Ouvrez la console navigateur (F12) pour voir les erreurs

### "Base de données réinitialisée"
➡️ Normal avec SQLite sur Render Free (conteneurs éphémères)
➡️ Solution: migrer vers PostgreSQL (voir DEPLOYMENT.md)

## 📝 Commandes utiles

```bash
# Voir les logs en temps réel
# Sur Render dashboard → votre service → Logs

# Forcer un redéploiement
# Sur Render dashboard → votre service → Manual Deploy → Deploy latest commit

# Mettre à jour le code
git add .
git commit -m "Update"
git push
# Render redéploie automatiquement !
```

## ⚡ Performances Free Tier

- ⏰ Le service s'endort après 15 min d'inactivité
- 🐌 Premier chargement: 30-60 secondes (réveil)
- 💰 Gratuit: 750h/mois (suffisant pour un projet perso)
- 🚀 Pour éviter le sleep: passez à un plan payant ($7/mois)

## 🎉 Prochaines étapes

- [ ] Ajoutez un nom de domaine personnalisé
- [ ] Migrez vers PostgreSQL pour persistence
- [ ] Configurez des sauvegardes automatiques
- [ ] Ajoutez rate limiting pour sécurité
- [ ] Optimisez les performances

---

**Votre app est maintenant en ligne et accessible partout ! 🌍**
