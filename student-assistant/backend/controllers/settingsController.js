// Contrôleur Paramètres
const User = require("../models/User");
const sqlite3 = require("sqlite3").verbose();
const db = require("../config/database").db;

exports.resetData = (req, res, next) => {
  // Supprime toutes les données personnelles de l’utilisateur
  db.run("DELETE FROM tasks WHERE user_id = ?", [req.user.id]);
  db.run("DELETE FROM notes WHERE user_id = ?", [req.user.id]);
  db.run("DELETE FROM forum WHERE user_id = ?", [req.user.id]);
  db.run("DELETE FROM answers WHERE user_id = ?", [req.user.id]);
  res.json({ message: "Données personnelles réinitialisées." });
};
