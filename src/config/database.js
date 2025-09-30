// Configuration et initialisation de la base de données SQLite
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', '..', 'data.sqlite');
const db = new sqlite3.Database(dbPath);

// Helper pour exécuter des requêtes avec Promises
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Initialisation des tables
function initDatabase() {
  db.serialize(() => {
    // Table users (avec authentification)
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      createdAt TEXT DEFAULT (datetime('now'))
    )`);

    // Table tasks
    db.run(`CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      priority TEXT DEFAULT 'medium',
      deadline TEXT,
      completed INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY(userId) REFERENCES users(id)
    )`);

    // Table courses
    db.run(`CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      color TEXT DEFAULT '#3B82F6',
      createdAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY(userId) REFERENCES users(id)
    )`);

    // Table notes
    db.run(`CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      courseId INTEGER NOT NULL,
      userId INTEGER NOT NULL,
      content TEXT NOT NULL,
      createdAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY(courseId) REFERENCES courses(id),
      FOREIGN KEY(userId) REFERENCES users(id)
    )`);

    // Table grades
    db.run(`CREATE TABLE IF NOT EXISTS grades (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      courseId INTEGER NOT NULL,
      userId INTEGER NOT NULL,
      label TEXT NOT NULL,
      score REAL NOT NULL,
      maxScore REAL DEFAULT 20,
      date TEXT,
      createdAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY(courseId) REFERENCES courses(id),
      FOREIGN KEY(userId) REFERENCES users(id)
    )`);

    console.log('✅ Base de données initialisée');
  });
}

module.exports = { db, run, get, all, initDatabase };
