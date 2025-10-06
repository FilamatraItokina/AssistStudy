// Modèle Note – gestion des notes de cours
const sqlite3 = require("sqlite3").verbose();
const db = require("../config/database").db;

const Note = {
  create: (note, callback) => {
    const sql = `INSERT INTO notes (user_id, subject, chapter, type, content) VALUES (?, ?, ?, ?, ?)`;
    db.run(
      sql,
      [note.user_id, note.subject, note.chapter, note.type, note.content],
      callback
    );
  },
  getAll: (user_id, callback) => {
    db.all(`SELECT * FROM notes WHERE user_id = ?`, [user_id], callback);
  },
  update: (id, data, callback) => {
    const sql = `UPDATE notes SET subject=?, chapter=?, type=?, content=? WHERE id=?`;
    db.run(
      sql,
      [data.subject, data.chapter, data.type, data.content, id],
      callback
    );
  },
  delete: (id, callback) => {
    db.run(`DELETE FROM notes WHERE id = ?`, [id], callback);
  },
};

module.exports = Note;
