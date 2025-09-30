# 🚀 Déploiement sur Render.com

Guide complet pour déployer Assistant Étudiant sur Render.com (gratuit).

## 📋 Prérequis

1. Compte GitHub (pour pousser votre code)
2. Compte Render.com (gratuit)
3. Code poussé sur un repository GitHub

## 🔧 Préparation du code

### 1. Ajustements backend

Le backend est déjà prêt. Assurez-vous que `.env` n'est PAS poussé sur GitHub (ajoutez-le au .gitignore).

### 2. Ajustements frontend

Le frontend doit pointer vers l'URL de production du backend après déploiement.

## 📤 Étape 1: Pousser sur GitHub

```bash
# Initialisez git si ce n'est pas déjà fait
git init

# Ajoutez .gitignore
echo "node_modules/
.env
data.sqlite
*.log
dist/
client/node_modules/
client/dist/" > .gitignore

# Ajoutez et commitez
git add .
git commit -m "Initial commit - Assistant Étudiant"

# Créez un repo sur GitHub et poussez
git remote add origin https://github.com/VOTRE_USERNAME/assistant-etudiant.git
git branch -M main
git push -u origin main
```

## 🌐 Étape 2: Déployer le Backend

### 2.1 Créer un Web Service sur Render

1. Connectez-vous sur [render.com](https://render.com)
2. Cliquez sur **"New +"** → **"Web Service"**
3. Connectez votre repository GitHub
4. Sélectionnez le repository **assistant-etudiant**

### 2.2 Configuration du service backend

Remplissez les champs:

| Champ | Valeur |
|-------|--------|
| **Name** | `assistant-etudiant-api` |
| **Region** | `Frankfurt (EU Central)` ou proche de vous |
| **Branch** | `main` |
| **Root Directory** | *(laisser vide)* |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm run server` |
| **Instance Type** | `Free` |

### 2.3 Variables d'environnement

Dans la section **Environment Variables**, ajoutez:

| Key | Value |
|-----|-------|
| `PORT` | `4000` |
| `JWT_SECRET` | *(générez une clé aléatoire sécurisée)* |
| `JWT_EXPIRES_IN` | `7d` |
| `NODE_ENV` | `production` |

**🔐 Pour générer JWT_SECRET**, utilisez:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2.4 Déployer

1. Cliquez sur **"Create Web Service"**
2. Attendez la fin du déploiement (5-10 min)
3. Notez l'URL générée (ex: `https://assistant-etudiant-api.onrender.com`)

## 🎨 Étape 3: Déployer le Frontend

### 3.1 Créer un Static Site sur Render

1. Retournez sur le dashboard Render
2. Cliquez sur **"New +"** → **"Static Site"**
3. Sélectionnez le même repository

### 3.2 Configuration du static site

| Champ | Valeur |
|-------|--------|
| **Name** | `assistant-etudiant-app` |
| **Branch** | `main` |
| **Root Directory** | `client` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

### 3.3 Variables d'environnement frontend

Ajoutez:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://assistant-etudiant-api.onrender.com` |

### 3.4 Ajuster le code frontend

Modifiez `client/src/utils/api.js` pour utiliser l'URL de production:

```javascript
const API_URL = import.meta.env.VITE_API_URL || '';

export const apiCall = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erreur API');
  }

  return response.json();
};
```

**Commitez et poussez ces changements:**
```bash
git add .
git commit -m "Configure production API URL"
git push
```

### 3.5 Déployer

Render déploiera automatiquement après le push.

## 🔧 Étape 4: Configuration CORS du backend

Modifiez `server.js` pour autoriser le frontend:

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://assistant-etudiant-app.onrender.com' // Remplacez par votre URL
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

Commitez et poussez:
```bash
git add .
git commit -m "Configure CORS for production"
git push
```

Render redéploiera automatiquement le backend.

## ✅ Étape 5: Tester

1. Ouvrez l'URL de votre frontend (ex: `https://assistant-etudiant-app.onrender.com`)
2. Inscrivez-vous avec un nouveau compte
3. Testez toutes les fonctionnalités

## ⚠️ Points importants

### Base de données SQLite sur Render

**Attention**: Render Free tier utilise des conteneurs éphémères. La base SQLite sera réinitialisée lors des redéploiements.

**Solutions:**

#### Option A: PostgreSQL gratuit (recommandé)
Migrez vers PostgreSQL (gratuit sur Render):
1. Créez une base PostgreSQL sur Render
2. Installez `pg` au lieu de `sqlite3`
3. Adaptez `src/config/database.js`

#### Option B: Stockage persistant (payant)
Utilisez Render Persistent Disks (payant).

### Performances Free Tier

- Le service s'endort après 15 min d'inactivité
- Premier chargement peut prendre 30-60 secondes
- Limité à 750h/mois

## 🔄 Redéploiement automatique

Render redéploie automatiquement à chaque push sur la branche `main`.

## 📊 Monitoring

1. Dashboard Render → Services
2. Cliquez sur votre service
3. Onglet **"Logs"** pour voir les logs en temps réel
4. Onglet **"Metrics"** pour les statistiques

## 🐛 Dépannage

### Build fails
- Vérifiez les logs de build
- Assurez-vous que `package.json` est correct
- Vérifiez que toutes les dépendances sont listées

### API ne répond pas
- Vérifiez que le backend est bien démarré (logs)
- Vérifiez les variables d'environnement
- Testez l'API directement: `https://votre-api.onrender.com/api/auth/login`

### CORS errors
- Vérifiez que l'URL frontend est dans `allowedOrigins`
- Vérifiez que `credentials: true` est configuré

### Frontend ne peut pas appeler l'API
- Vérifiez `VITE_API_URL` dans les env vars du frontend
- Ouvrez la console navigateur pour voir les erreurs

## 🚀 Améliorer les performances

1. **Utiliser PostgreSQL** au lieu de SQLite
2. **Activer le cache** avec Redis (addon Render)
3. **Passer à un plan payant** pour éviter le sleep
4. **Optimiser les images** et assets
5. **Activer la compression** gzip dans Express

## 🔐 Sécurité en production

- ✅ JWT_SECRET aléatoire et sécurisé
- ✅ HTTPS automatique (géré par Render)
- ✅ Variables d'environnement sécurisées
- ✅ CORS configuré correctement
- ⚠️ Ajoutez rate limiting (express-rate-limit)
- ⚠️ Ajoutez helmet.js pour sécurité headers
- ⚠️ Validez toutes les entrées utilisateur

## 📝 Commandes utiles

```bash
# Voir les logs backend en temps réel
render logs -s assistant-etudiant-api

# Redéployer manuellement
render deploy -s assistant-etudiant-api

# SSH dans le conteneur (plans payants)
render ssh assistant-etudiant-api
```

---

**Votre application est maintenant en ligne ! 🎉**

URLs d'exemple:
- Frontend: https://assistant-etudiant-app.onrender.com
- Backend API: https://assistant-etudiant-api.onrender.com
