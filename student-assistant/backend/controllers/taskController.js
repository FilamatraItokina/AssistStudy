// Contrôleur Tâches
const Task = require("../models/Task");

exports.getTasks = (req, res, next) => {
  Task.getAll(req.user.id, (err, tasks) => {
    if (err) return next(err);
    res.json(tasks);
  });
};

exports.createTask = (req, res, next) => {
  const { title, subject, due_date } = req.body;
  if (!title) return res.status(400).json({ error: "Titre requis." });
  Task.create(
    { user_id: req.user.id, title, subject, due_date, completed: false },
    (err) => {
      if (err) return next(err);
      res.status(201).json({ message: "Tâche créée." });
    }
  );
};

exports.updateTask = (req, res, next) => {
  const { title, subject, due_date, completed } = req.body;
  Task.update(req.params.id, { title, subject, due_date, completed }, (err) => {
    if (err) return next(err);
    res.json({ message: "Tâche mise à jour." });
  });
};

exports.deleteTask = (req, res, next) => {
  Task.delete(req.params.id, (err) => {
    if (err) return next(err);
    res.json({ message: "Tâche supprimée." });
  });
};
