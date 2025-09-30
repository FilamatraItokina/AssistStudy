// Routes d'authentification
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// POST /api/auth/register - Inscription
router.post('/register', authController.register);

// POST /api/auth/login - Connexion
router.post('/login', authController.login);

// GET /api/auth/me - Profil (protégé)
router.get('/me', authenticateToken, authController.me);

module.exports = router;
