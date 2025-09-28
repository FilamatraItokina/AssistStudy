const db = require('../data');

db.run(
  `
  CREATE TABLE IF NOT EXISTS subjects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id)
  )
  `
);

const Subject = {
  Create: (title, userId, callback) => {
    db.run(`
      INSERT INTO subjects (title, user_id) VALUES (?, ?)
      `,
      [title, userId],
      function(err){
        callback(err, {id: this.lastID, title});
      }
    );
  },

  ReadSub: (userId, callback) => {
    db.all(
      `
      SELECT * FROM subjects WHERE user_id = ?
      `,
      [userId],
      (err, sub) => {
        callback(err, sub);
      }
    );
  },

  UpdateSub: (title, userId, id, callback) => {
    db.run(
      `
      UPDATE subjects SET title = ? WHERE user_id = ? AND id = ?
      `,
      [title, userId, id],
      function(err, changes){
        callback(err, {changes: this.changes});
      }
    );
  },

  DeleteSub: (id, userId, callback) => {
    db.run(
      `
      DELETE FROM subjects WHERE user_id = ? AND id = ?
      `,
      [userId, id],
      function(err, changes){
        callback(err, changes);
      }
    );
  },

  GetId: (userId, callback) => {
    db.all(
      `
      SELECT * FROM subjects WHERE user_id = ?
      `,
      [userId],
      (err, subject) => {
        callback(err, subject);
      }
    );
  }
}

module.exports = Subject;