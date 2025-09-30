// Modèle Note
const { run, get, all } = require('../config/database');

const Note = {
  async findByCourseId(courseId, userId) {
    return await all(
      'SELECT * FROM notes WHERE courseId = ? AND userId = ? ORDER BY createdAt DESC',
      [courseId, userId]
    );
  },

  async findById(id, userId) {
    return await get('SELECT * FROM notes WHERE id = ? AND userId = ?', [id, userId]);
  },

  async create({ userId, courseId, content }) {
    const result = await run(
      'INSERT INTO notes (userId, courseId, content) VALUES (?, ?, ?)',
      [userId, courseId, content]
    );
    return this.findById(result.id, userId);
  },

  async update(id, userId, { content }) {
    const current = await this.findById(id, userId);
    if (!current) return null;

    await run(
      'UPDATE notes SET content = ? WHERE id = ? AND userId = ?',
      [content !== undefined ? content : current.content, id, userId]
    );
    return this.findById(id, userId);
  },

  async delete(id, userId) {
    const result = await run('DELETE FROM notes WHERE id = ? AND userId = ?', [id, userId]);
    return result.changes > 0;
  }
};

module.exports = Note;
