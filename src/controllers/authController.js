// Contrôleur d'authentification
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authController = {
  // Inscription
  async register(req, res) {
    try {
      const { email, password, name } = req.body;

      // Validation simple
      if (!email || !password || !name) {
        return res.status(400).json({ error: 'Tous les champs sont requis.' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères.' });
      }

      // Vérifier si l'email existe déjà
      const existing = await User.findByEmail(email);
      if (existing) {
        return res.status(400).json({ error: 'Cet email est déjà utilisé.' });
      }

      // Créer l'utilisateur
      const user = await User.create({ email, password, name });

      // Générer le token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.status(201).json({
        message: 'Inscription réussie',
        token,
        user: { id: user.id, email: user.email, name: user.name }
      });
    } catch (error) {
      console.error('Erreur inscription:', error);
      res.status(500).json({ error: 'Erreur lors de l\'inscription.' });
    }
  },

  // Connexion
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis.' });
      }

      // Trouver l'utilisateur
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
      }

      // Vérifier le mot de passe
      const isValid = await User.verifyPassword(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
      }

      // Générer le token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.json({
        message: 'Connexion réussie',
        token,
        user: { id: user.id, email: user.email, name: user.name }
      });
    } catch (error) {
      console.error('Erreur connexion:', error);
      res.status(500).json({ error: 'Erreur lors de la connexion.' });
    }
  },

  // Vérifier le token (profil)
  async me(req, res) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé.' });
      }
      res.json({ user });
    } catch (error) {
      console.error('Erreur profil:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération du profil.' });
    }
  }
};

module.exports = authController;
