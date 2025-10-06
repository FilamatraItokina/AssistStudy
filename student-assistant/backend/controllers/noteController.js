// Contrôleur Notes
const Note = require("../models/Note");

exports.getNotes = (req, res, next) => {
  Note.getAll(req.user.id, (err, notes) => {
    if (err) return next(err);
    res.json(notes);
  });
};

exports.createNote = (req, res, next) => {
  const { subject, chapter, type, content } = req.body;
  if (!content) return res.status(400).json({ error: "Contenu requis." });
  Note.create(
    { user_id: req.user.id, subject, chapter, type, content },
    (err) => {
      if (err) return next(err);
      res.status(201).json({ message: "Note créée." });
    }
  );
};

exports.updateNote = (req, res, next) => {
  const { subject, chapter, type, content } = req.body;
  Note.update(req.params.id, { subject, chapter, type, content }, (err) => {
    if (err) return next(err);
    res.json({ message: "Note mise à jour." });
  });
};

exports.deleteNote = (req, res, next) => {
  Note.delete(req.params.id, (err) => {
    if (err) return next(err);
    res.json({ message: "Note supprimée." });
  });
};
