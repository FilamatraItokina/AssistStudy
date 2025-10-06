// Contrôleur Forum
const Forum = require("../models/Forum");

exports.getQuestions = (req, res, next) => {
  Forum.getAll((err, questions) => {
    if (err) return next(err);
    res.json(questions);
  });
};

exports.postQuestion = (req, res, next) => {
  const { category, title, content } = req.body;
  if (!title || !content)
    return res.status(400).json({ error: "Titre et contenu requis." });
  Forum.postQuestion(
    { user_id: req.user.id, category, title, content },
    (err) => {
      if (err) return next(err);
      res.status(201).json({ message: "Question postée." });
    }
  );
};

exports.postAnswer = (req, res, next) => {
  const { forum_id, content } = req.body;
  if (!content) return res.status(400).json({ error: "Contenu requis." });
  Forum.postAnswer({ forum_id, user_id: req.user.id, content }, (err) => {
    if (err) return next(err);
    res.status(201).json({ message: "Réponse postée." });
  });
};

exports.getAnswers = (req, res, next) => {
  Forum.getAnswers(req.params.id, (err, answers) => {
    if (err) return next(err);
    res.json(answers);
  });
};

exports.deleteMessage = (req, res, next) => {
  Forum.deleteMessage(req.params.id, req.user.id, (err) => {
    if (err) return next(err);
    res.json({ message: "Message supprimé." });
  });
};
