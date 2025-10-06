// Contrôleur Authentification – Inscription, Connexion
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

exports.register = (req, res, next) => {
  const { name, email, password, field, level, goals } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "Champs requis manquants." });
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return next(err);
    User.create({ name, email, password: hash, field, level, goals }, (err) => {
      if (err) return next(err);
      res.status(201).json({ message: "Inscription réussie." });
    });
  });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Champs requis manquants." });
  User.findByEmail(email, (err, user) => {
    if (err || !user)
      return res.status(401).json({ error: "Utilisateur non trouvé." });
    bcrypt.compare(password, user.password, (err, valid) => {
      if (err || !valid)
        return res.status(401).json({ error: "Mot de passe incorrect." });
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          field: user.field,
          level: user.level,
          goals: user.goals,
        },
      });
    });
  });
};
