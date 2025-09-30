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
  // Ajoutez ici l'URL de votre frontend sur Render
  // Ex: 'https://assistant-etudiant-app.onrender.com'
];

// Récupérer l'origine depuis les variables d'environnement si définie
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: function(origin, callback) {
    // Autoriser les requêtes sans origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Origin non autorisée:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

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
