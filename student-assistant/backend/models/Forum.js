// Modèle Forum – gestion du forum communautaire
const sqlite3 = require("sqlite3").verbose();
const db = require("../config/database").db;

const Forum = {
  postQuestion: (question, callback) => {
    const sql = `INSERT INTO forum (user_id, category, title, content, created_at) VALUES (?, ?, ?, ?, datetime('now'))`;
    db.run(
      sql,
      [question.user_id, question.category, question.title, question.content],
      callback
    );
  },
  getAll: (callback) => {
    db.all(
      `SELECT forum.*, users.name FROM forum JOIN users ON forum.user_id = users.id ORDER BY created_at DESC`,
      [],
      callback
    );
  },
  postAnswer: (answer, callback) => {
    const sql = `INSERT INTO answers (forum_id, user_id, content, created_at) VALUES (?, ?, ?, datetime('now'))`;
    db.run(sql, [answer.forum_id, answer.user_id, answer.content], callback);
  },
  getAnswers: (forum_id, callback) => {
    db.all(
      `SELECT answers.*, users.name FROM answers JOIN users ON answers.user_id = users.id WHERE forum_id = ? ORDER BY created_at ASC`,
      [forum_id],
      callback
    );
  },
  deleteMessage: (id, user_id, callback) => {
    db.run(
      `DELETE FROM forum WHERE id = ? AND user_id = ?`,
      [id, user_id],
      callback
    );
  },
};

module.exports = Forum;
