# Student Assistant – Documentation complète

## Présentation

Application web d’assistance aux étudiants : gestion des tâches, notes, forum, motivation, profil et paramètres. Frontend React + CSS pur, backend Node.js + Express + SQLite.

## Structure du projet

```
student-assistant/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── server.js
│   ├── package.json
│   └── README.md
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   ├── styles/
    │   ├── App.jsx
    │   └── index.jsx
    ├── package.json
    └── README.md
```

## Fonctionnalités principales

- Authentification JWT (inscription, connexion, sécurité bcrypt)
- Profil étudiant (nom, filière, niveau, objectifs)
- Tableau de bord personnalisé
- Gestionnaire de tâches (CRUD, filtres, progression)
- Agenda simple (affichage par date)
- Notifications locales (rappels)
- Gestion des notes de cours (CRUD, catégories, recherche)
- Forum étudiant (questions/réponses, catégories, suppression)
- Barre de progression et objectifs hebdomadaires
- Citation de motivation quotidienne
- Paramètres (mode clair/sombre, langue, sauvegarde, réinitialisation)

## Technologies

- **Frontend** : React, CSS pur, React Router
- **Backend** : Node.js, Express, SQLite, JWT, bcrypt
- **Déploiement** : Vercel (frontend), Render/Heroku (backend)

## Installation

1. Cloner le projet :
   ```bash
   git clone <repo-url>
   cd student-assistant
   ```

````
2. Installer les dépendances :
   ```bash
cd backend && npm install
cd ../frontend && npm install
````

3. Configurer les variables d’environnement :
   - Backend : copier `.env.example` en `.env` et renseigner les valeurs
   - Frontend : créer un fichier `.env` avec `REACT_APP_API_URL=<url-backend>`
4. Lancer en local :
   - Backend : `npm run dev` (ou `npm start`)
   - Frontend : `npm start`

## API Backend

- `/api/auth/register` : inscription
- `/api/auth/login` : connexion
- `/api/user/profile` : profil étudiant (GET/PUT)
- `/api/tasks` : gestion des tâches (GET/POST/PUT/DELETE)
- `/api/notes` : gestion des notes (GET/POST/PUT/DELETE)
- `/api/forum` : forum (GET/POST/DELETE)
- `/api/forum/answer` : réponse forum (POST)
- `/api/progress` : progression (GET)
- `/api/settings/reset` : réinitialisation des données (POST)

## Frontend

- Pages : Dashboard, Login, Register, Profile, Tasks, Notes, Forum, Motivation, Settings
- Context : AuthContext, ThemeContext
- Composants : Navbar, TaskList, NoteList, ForumList
- Styles : global.css, components.css

## Sécurité

- Authentification JWT
- Hashage des mots de passe avec bcrypt
- CORS configuré
- Validation des données côté backend

## Sauvegarde

- Toutes les données sont stockées dans `database.sqlite` (backend)

## Déploiement

Voir le guide Render ci-dessous.
