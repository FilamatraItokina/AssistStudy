const Mark = require('../models/mark.model');

//Ajouter une note
exports.addNewMark = (req, res) => {
  const {value, coeff, date, examenId} = req.body;
  const userId = req.user.id;
  const subId = req.body.subject_id;

  if(!value || !coeff || !date || !examenId) return res.status(400).json({ message: "All infos required" });

  Mark.Create(subId, userId, examenId, value, coeff, date, (err, result) => {
    if(err) return res.status(500).json({ error: err.message });

    return res.status(201).json({ message: "Mark added", result });
  });
}

