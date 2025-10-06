// Modèle User – gestion des étudiants
const sqlite3 = require("sqlite3").verbose();
const db = require("../config/database").db;

const User = {
  create: (user, callback) => {
    const sql = `INSERT INTO users (name, email, password, field, level, goals) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(
      sql,
      [
        user.name,
        user.email,
        user.password,
        user.field,
        user.level,
        user.goals,
      ],
      callback
    );
  },
  findByEmail: (email, callback) => {
    db.get(`SELECT * FROM users WHERE email = ?`, [email], callback);
  },
  findById: (id, callback) => {
    db.get(`SELECT * FROM users WHERE id = ?`, [id], callback);
  },
  updateProfile: (id, data, callback) => {
    const sql = `UPDATE users SET name=?, field=?, level=?, goals=? WHERE id=?`;
    db.run(sql, [data.name, data.field, data.level, data.goals, id], callback);
  },
};

module.exports = User;
