// Contrôleur Progression
const Progress = require("../models/Progress");

exports.getProgress = (req, res, next) => {
  Progress.getUserProgress(req.user.id, (err, stats) => {
    if (err) return next(err);
    res.json(stats);
  });
};

exports.setWeeklyGoal = (req, res, next) => {
  const { goal } = req.body;
  Progress.setWeeklyGoal(req.user.id, goal, (err) => {
    if (err) return next(err);
    res.json({ message: "Objectif hebdomadaire mis à jour." });
  });
};
