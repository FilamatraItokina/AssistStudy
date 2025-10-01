// Point d'entrée du serveur Express
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDatabase } = require('./src/config/database');

// Import des routes
const authRoutes = require('./src/routes/authRoutes');
const taskRoutes = require('./src/routes/taskRoutes');
const courseRoutes = require('./src/routes/courseRoutes');
const noteRoutes = require('./src/routes/noteRoutes');
const gradeRoutes = require('./src/routes/gradeRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// Initialisation de la base de données
initDatabase();

// Middlewares
// Configuration CORS pour production et développement
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://assistant-etudiant-app.onrender.com'
];

// Récupérer l'origine depuis les variables d'environnement si définie
if (process.env.FRONTEND_URL) {
  // Supprimer le / à la fin si présent
  const frontendUrl = process.env.FRONTEND_URL.endsWith('/') 
    ? process.env.FRONTEND_URL.slice(0, -1)
    : process.env.FRONTEND_URL;
  
  allowedOrigins.push(frontendUrl);
  console.log('URL frontend autorisée:', frontendUrl);
}

console.log('Origines autorisées:', allowedOrigins);

// Configuration CORS personnalisée
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  if (allowedOrigins.some(allowedOrigin => 
    origin === allowedOrigin || 
    (origin && (origin.startsWith(allowedOrigin + '/') ||
    origin === `https://${allowedOrigin}` ||
    origin === `http://${allowedOrigin}`))
  ) || !origin) {
    res.setHeader('Access-Control-Allow-Origin', origin || allowedOrigins[0]);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  
  // Répondre immédiatement aux requêtes OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/grades', gradeRoutes);

// Route de vérification de l'API
const healthCheckRouter = require('./src/routes/healthCheck');
app.use('/api/auth', healthCheckRouter);

// Route racine
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur serveur' });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
