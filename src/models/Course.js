// Modèle Course
const { run, get, all } = require('../config/database');

const Course = {
  async findByUserId(userId) {
    return await all('SELECT * FROM courses WHERE userId = ? ORDER BY name ASC', [userId]);
  },

  async findById(id, userId) {
    return await get('SELECT * FROM courses WHERE id = ? AND userId = ?', [id, userId]);
  },

  async create({ userId, name, description, color }) {
    const result = await run(
      'INSERT INTO courses (userId, name, description, color) VALUES (?, ?, ?, ?)',
      [userId, name, description || '', color || '#3B82F6']
    );
    return this.findById(result.id, userId);
  },

  async update(id, userId, data) {
    const current = await this.findById(id, userId);
    if (!current) return null;

    const { name, description, color } = data;
    await run(
      'UPDATE courses SET name = ?, description = ?, color = ? WHERE id = ? AND userId = ?',
      [
        name !== undefined ? name : current.name,
        description !== undefined ? description : current.description,
        color !== undefined ? color : current.color,
        id,
        userId
      ]
    );
    return this.findById(id, userId);
  },

  async delete(id, userId) {
    const result = await run('DELETE FROM courses WHERE id = ? AND userId = ?', [id, userId]);
    return result.changes > 0;
  }
};

module.exports = Course;
