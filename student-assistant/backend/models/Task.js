// Modèle Task – gestion des tâches
const sqlite3 = require("sqlite3").verbose();
const db = require("../config/database").db;

const Task = {
  create: (task, callback) => {
    const sql = `INSERT INTO tasks (user_id, title, subject, due_date, completed) VALUES (?, ?, ?, ?, ?)`;
    db.run(
      sql,
      [
        task.user_id,
        task.title,
        task.subject,
        task.due_date,
        task.completed ? 1 : 0,
      ],
      callback
    );
  },
  getAll: (user_id, callback) => {
    db.all(`SELECT * FROM tasks WHERE user_id = ?`, [user_id], callback);
  },
  update: (id, data, callback) => {
    const sql = `UPDATE tasks SET title=?, subject=?, due_date=?, completed=? WHERE id=?`;
    db.run(
      sql,
      [data.title, data.subject, data.due_date, data.completed ? 1 : 0, id],
      callback
    );
  },
  delete: (id, callback) => {
    db.run(`DELETE FROM tasks WHERE id = ?`, [id], callback);
  },
};

module.exports = Task;
