const Sub = require('../models/subject.model');

exports.addSub = (req, res) => {
  const title = req.body;
  const userId = req.user.id;

  Sub.Create(title, userId, (err, subject) => {
    if(err) return res.status(500).json({ error: err.message });

    return res.status(201).json({ message: "Subject added", subject });
  });
}

exports.readAll = (req, res) => {
  const userId = req.user.id;

  Sub.ReadSub(userId, (err, subjects) => {
    if(err) return res.status(500).json({ error: err.message });
    if(!subjects) return res.status(404).json({ message: "No subjects found" });

    return res.status(200).json(subjects);
  });
}

exports.update = (req, res) => {
  const userId = req.user.id;
  const title = req.body;
  const id = req.params.id;

  Sub.UpdateSub(id, userId, (err, changes) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!subjects)
      return res.status(404).json({ message: "No subjects found" });

    return res.status(200).json(changes);
  });
}

exports.delete = (req, res) => {
  const userId = req.user.id;
  const id = req.params.id;

  Sub.DeleteSub(id, userId, (err, changes) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!changes)
      return res.status(404).json({ message: "No subjects found" });

    return res.status(200).json(changes);
  });
}