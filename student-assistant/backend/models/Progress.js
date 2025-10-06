// Modèle Progress – suivi de la progression
const sqlite3 = require("sqlite3").verbose();
const db = require("../config/database").db;

const Progress = {
  getUserProgress: (user_id, callback) => {
    db.get(
      `SELECT COUNT(*) as total, SUM(completed) as done FROM tasks WHERE user_id = ?`,
      [user_id],
      callback
    );
  },
  setWeeklyGoal: (user_id, goal, callback) => {
    db.run(
      `UPDATE users SET goals = ? WHERE id = ?`,
      [goal, user_id],
      callback
    );
  },
};

module.exports = Progress;
