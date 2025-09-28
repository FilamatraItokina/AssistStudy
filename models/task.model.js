const db = require('../data');

db.run(`
  CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  createdAt DATE NOT NULL DEFAULT CURRENT_STAMP,
  category TEXT NOT NULL,
  done BOOLEAN DEFAULT false,
  subject_id INTEGER DEFAULT 0,
  desc TEXT DEFAULT '',
  priority INTEGER CHECK(priority IN (1, 2, 3)),
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(subject_id) REFERENCES subjects(id)
  )
  `);

const Task = {
  Create: (title, ctg, subjectId, userId, desc, priority, callback) => {
    db.run(
      `
      INSERT INTO tasks (title, category, subject_id, user_id, desc, priority) VALUES (?,?,?,?,?,?)
      `,
      [title, ctg, subjectId, userId, desc, priority],
      function(err, result){
        callback(err, {
          id: this.lastID, 
          title,
          ctg,
          desc,
          priority,
          subjectId
        });
      }
    );
  },
  
  ReadAllTasks: (userId, callback) => {
    db.all(`
      SELECT * FROM tasks WHERE user_id = ?
      `,
    [userId],
    function(err, tasks){
      callback(err, tasks);
    }
    );
  },

  //Lire selon la matiere
  ReadBySub: (userId, subId, callback) => {
    db.all(
      `
      SELECT * FROM tasks WHERE user_id = ? AND subject_id = ?
      `,
      [userId, subId],
      function(err, tasks){
        callback(err, tasks);
      }
    );
  },
  
  //Lire selon la priorite
  ReadByPriority: (userId, priority, callback) => {
    db.all(
      `
      SELECT * FROM tasks WHERE user_id = ? AND priority = ?
      `,
      [userId, priority],
      function (err, tasks) {
        callback(err, tasks);
      }
    );
  },

  //Par priorite dans une matiere
  ByPrioInSub: (userId, subId, priority, callback) => {
    db.all(
      `
      SELECT * FROM tasks WHERE user_id = ? AND subject_id = ? AND priority = ?
      `,
      [userId, subId, priority],
      function (err, tasks) {
        callback(err, tasks);
      }
    );
  },

  UpdateTask: (title, ctg, priority, desc, userId, subId) => {
    db.run(
      `
      UPDATE tasks SET title = ?, category = ?, desc = ?, priority = ?, subject_id = ? WHERE user_id = ?
      `,
      [title, ctg, desc, priority, userId, subId], 
      (err, result) => {
        callback(err, result);
      }
    );
  },

  DeleteTask: (userId, subId, callback) => {
    db.run(`
      DELETE FROM tasks WHERE user_id = ? AND subject_id = ? AND id = ?
      `,
      [userId, subId, id],
      (err, result) => {
        callback(err, result);
      }
    )
  }
}

module.exports = Task;