// Contrôleur des notes d'examens
const Grade = require('../models/Grade');

const gradeController = {
  async listByCourse(req, res) {
    try {
      const grades = await Grade.findByCourseId(req.params.courseId, req.user.id);
      res.json(grades);
    } catch (error) {
      console.error('Erreur liste grades:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des notes.' });
    }
  },

  async create(req, res) {
    try {
      const { courseId, label, score, maxScore, date } = req.body;
      if (!courseId || !label || score === undefined) {
        return res.status(400).json({ error: 'courseId, label et score sont requis.' });
      }

      const grade = await Grade.create({
        userId: req.user.id,
        courseId,
        label,
        score,
        maxScore,
        date
      });

      res.status(201).json(grade);
    } catch (error) {
      console.error('Erreur création grade:', error);
      res.status(500).json({ error: 'Erreur lors de la création de la note.' });
    }
  },

  async update(req, res) {
    try {
      const grade = await Grade.update(req.params.id, req.user.id, req.body);
      if (!grade) {
        return res.status(404).json({ error: 'Note non trouvée.' });
      }
      res.json(grade);
    } catch (error) {
      console.error('Erreur mise à jour grade:', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour de la note.' });
    }
  },

  async delete(req, res) {
    try {
      const success = await Grade.delete(req.params.id, req.user.id);
      if (!success) {
        return res.status(404).json({ error: 'Note non trouvée.' });
      }
      res.json({ message: 'Note supprimée avec succès.' });
    } catch (error) {
      console.error('Erreur suppression grade:', error);
      res.status(500).json({ error: 'Erreur lors de la suppression de la note.' });
    }
  },

  async getAverages(req, res) {
    try {
      const averages = await Grade.getAverages(req.user.id);
      res.json(averages);
    } catch (error) {
      console.error('Erreur moyennes:', error);
      res.status(500).json({ error: 'Erreur lors du calcul des moyennes.' });
    }
  }
};

module.exports = gradeController;
