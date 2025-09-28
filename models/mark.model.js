const db = require('../data');

db.run(
  `
  CREATE TABLE IF NOT EXISTS marks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subject_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  examen_id INTEGER NOT NULL,
  value REAL NOT NULL,
  coeff REAL NOT NULL DEFAULT 1,
  date TEXT,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(subject_id) REFERENCES subjects(id)
  )
  `
);


const Mark = {
  //New mark
  Create: (subId, userId, examId, value, coeff, date, callback) => {
    db.run(
      `
      INSERT INTO marks (subject_id, user_id, examen_id, value, coeff, date) VALUES (?,?,?,?,?,?)
      `,
      [subId, userId, examId, value, coeff, date],
      function (err, result) {
        callback(err, { id: this.lastID, result });
      }
    );
  },

  //Lire
  Read: (user_id, callback) => {
    db.all(
      `
      SELECT * FORM marks WHERE user_id = ?
      `,
      [user_id],
      function (err, marks) {
        callback(err, marks);
      }
    );
  },

  //Modifier
  Update: (subId, userId, examId, value, coeff, date, id, callback) => {
    db.run(
      `
      UPDATE marks SET subject_id = ?, examen_id = ?, value = ?, coeff = ?, date = ? WHERE user_id = ? AND id = ?
      `,
      [subId, examId, value, coeff, date, userId, id],
      function (err, result) {
        callback(err, result);
      }
    );
  },

  //Supprimer
  Delete: (user_id, id, callback) => {
    db.run(
      `
      DELETE FROM marks WHERE user_id = ? AND id = ?
      `,
      [user_id, id],
      (err, result) => {
        callback(err, result);
      }
    );
  }
};

module.exports = Mark;