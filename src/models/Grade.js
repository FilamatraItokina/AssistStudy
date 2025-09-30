// Modèle Grade (notes d'examens)
const { run, get, all } = require('../config/database');

const Grade = {
  async findByCourseId(courseId, userId) {
    return await all(
      'SELECT * FROM grades WHERE courseId = ? AND userId = ? ORDER BY date ASC',
      [courseId, userId]
    );
  },

  async findById(id, userId) {
    return await get('SELECT * FROM grades WHERE id = ? AND userId = ?', [id, userId]);
  },

  async create({ userId, courseId, label, score, maxScore, date }) {
    const result = await run(
      'INSERT INTO grades (userId, courseId, label, score, maxScore, date) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, courseId, label, score, maxScore || 20, date || null]
    );
    return this.findById(result.id, userId);
  },

  async update(id, userId, data) {
    const current = await this.findById(id, userId);
    if (!current) return null;

    const { label, score, maxScore, date } = data;
    await run(
      'UPDATE grades SET label = ?, score = ?, maxScore = ?, date = ? WHERE id = ? AND userId = ?',
      [
        label !== undefined ? label : current.label,
        score !== undefined ? score : current.score,
        maxScore !== undefined ? maxScore : current.maxScore,
        date !== undefined ? date : current.date,
        id,
        userId
      ]
    );
    return this.findById(id, userId);
  },

  async delete(id, userId) {
    const result = await run('DELETE FROM grades WHERE id = ? AND userId = ?', [id, userId]);
    return result.changes > 0;
  },

  // Calcul des moyennes par cours et générale
  async getAverages(userId) {
    const byCourse = await all(`
      SELECT 
        c.id as courseId,
        c.name as courseName,
        ROUND(AVG((g.score / g.maxScore) * 20), 2) as average
      FROM grades g
      JOIN courses c ON g.courseId = c.id
      WHERE g.userId = ?
      GROUP BY c.id, c.name
      ORDER BY c.name ASC
    `, [userId]);

    const overallRow = await get(`
      SELECT ROUND(AVG((score / maxScore) * 20), 2) as overall
      FROM grades
      WHERE userId = ?
    `, [userId]);

    return {
      byCourse,
      overall: overallRow ? overallRow.overall : null
    };
  }
};

module.exports = Grade;
