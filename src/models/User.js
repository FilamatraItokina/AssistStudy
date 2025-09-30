// Modèle User avec méthodes CRUD
const { run, get, all } = require('../config/database');
const bcrypt = require('bcrypt');

const User = {
  // Créer un utilisateur (avec hash du mot de passe)
  async create({ email, password, name }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await run(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      [email, hashedPassword, name]
    );
    return this.findById(result.id);
  },

  // Trouver par ID
  async findById(id) {
    return await get('SELECT id, email, name, createdAt FROM users WHERE id = ?', [id]);
  },

  // Trouver par email (avec mot de passe pour l'authentification)
  async findByEmail(email) {
    return await get('SELECT * FROM users WHERE email = ?', [email]);
  },

  // Vérifier le mot de passe
  async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
};

module.exports = User;
