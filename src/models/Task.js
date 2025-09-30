// Modèle Task
const { run, get, all } = require('../config/database');

const Task = {
  // Liste des tâches d'un utilisateur
  async findByUserId(userId, filters = {}) {
    let sql = 'SELECT * FROM tasks WHERE userId = ?';
    const params = [userId];

    if (filters.priority) {
      sql += ' AND priority = ?';
      params.push(filters.priority);
    }

    if (filters.completed !== undefined) {
      sql += ' AND completed = ?';
      params.push(filters.completed ? 1 : 0);
    }

    sql += ' ORDER BY completed ASC, deadline ASC';
    return await all(sql, params);
  },

  // Trouver par ID
  async findById(id, userId) {
    return await get('SELECT * FROM tasks WHERE id = ? AND userId = ?', [id, userId]);
  },

  // Créer une tâche
  async create(data) {
    const { userId, title, description, priority, deadline } = data;
    const result = await run(
      'INSERT INTO tasks (userId, title, description, priority, deadline) VALUES (?, ?, ?, ?, ?)',
      [userId, title, description || '', priority || 'medium', deadline || null]
    );
    return this.findById(result.id, userId);
  },

  // Mettre à jour
  async update(id, userId, data) {
    const current = await this.findById(id, userId);
    if (!current) return null;

    const { title, description, priority, deadline, completed } = data;
    await run(
      'UPDATE tasks SET title = ?, description = ?, priority = ?, deadline = ?, completed = ? WHERE id = ? AND userId = ?',
      [
        title !== undefined ? title : current.title,
        description !== undefined ? description : current.description,
        priority !== undefined ? priority : current.priority,
        deadline !== undefined ? deadline : current.deadline,
        completed !== undefined ? (completed ? 1 : 0) : current.completed,
        id,
        userId
      ]
    );
    return this.findById(id, userId);
  },

  // Supprimer
  async delete(id, userId) {
    const result = await run('DELETE FROM tasks WHERE id = ? AND userId = ?', [id, userId]);
    return result.changes > 0;
  }
};

module.exports = Task;
