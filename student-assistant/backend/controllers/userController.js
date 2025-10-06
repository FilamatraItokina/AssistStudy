// Contrôleur Profil utilisateur
const User = require("../models/User");

exports.getProfile = (req, res, next) => {
  User.findById(req.user.id, (err, user) => {
    if (err || !user)
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      field: user.field,
      level: user.level,
      goals: user.goals,
    });
  });
};

exports.updateProfile = (req, res, next) => {
  const { name, field, level, goals } = req.body;
  User.updateProfile(req.user.id, { name, field, level, goals }, (err) => {
    if (err) return next(err);
    res.json({ message: "Profil mis à jour." });
  });
};
