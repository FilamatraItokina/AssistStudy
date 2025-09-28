const db = require('../data');

db.run(
  `
  CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
  )
  `
);

const User = {
  Create: (username, email, password, callback) => {
    db.run(`
      INSERT INTO users (username, email, password) VALUES (?,?,?)
      `,
      [username, email, password],
      function(err, result){
        callback(err, {id: this.lastID, username, email});
      }
    );
  },

  FindByEmail: (email, callback) => {
    db.get(
      `
      SELECT * FROM users WHERE email = ?
      `,
      [email],
      function(err, user){
        callback(err, user);
      }
    );
  }
}

module.exports = User;