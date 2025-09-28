const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.db', (err) => {
  if(err) return console.log('Error database');
  return console.log('Connected to the database');
});


module.exports = db;