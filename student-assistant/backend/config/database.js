// Configuration et initialisation de la base SQLite
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath =
  process.env.DATABASE_URL || path.join(__dirname, "../database.sqlite");
const db = new sqlite3.Database(dbPath);

function initDB() {
  // Table utilisateurs
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    field TEXT,
    level TEXT,
    goals TEXT
  )`);
  // Table tâches
  db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT,
    subject TEXT,
    due_date TEXT,
    completed INTEGER DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
  // Table notes
  db.run(`CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    subject TEXT,
    chapter TEXT,
    type TEXT,
    content TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
  // Table forum
  db.run(`CREATE TABLE IF NOT EXISTS forum (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    category TEXT,
    title TEXT,
    content TEXT,
    created_at TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
  // Table réponses forum
  db.run(`CREATE TABLE IF NOT EXISTS answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    forum_id INTEGER,
    user_id INTEGER,
    content TEXT,
    created_at TEXT,
    FOREIGN KEY(forum_id) REFERENCES forum(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
}

module.exports = { db, initDB };
