// Contrôleur des cours
const Course = require('../models/Course');
const Note = require('../models/Note');
const Grade = require('../models/Grade');

const courseController = {
  async list(req, res) {
    try {
      const courses = await Course.findByUserId(req.user.id);
      res.json(courses);
    } catch (error) {
      console.error('Erreur liste cours:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des cours.' });
    }
  },

  async get(req, res) {
    try {
      const course = await Course.findById(req.params.id, req.user.id);
      if (!course) {
        return res.status(404).json({ error: 'Cours non trouvé.' });
      }

      // Récupérer les notes et grades associés
      const notes = await Note.findByCourseId(course.id, req.user.id);
      const grades = await Grade.findByCourseId(course.id, req.user.id);

      res.json({ ...course, notes, grades });
    } catch (error) {
      console.error('Erreur détail cours:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération du cours.' });
    }
  },

  async create(req, res) {
    try {
      const { name, description, color } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Le nom du cours est requis.' });
      }

      const course = await Course.create({
        userId: req.user.id,
        name,
        description,
        color
      });

      res.status(201).json(course);
    } catch (error) {
      console.error('Erreur création cours:', error);
      res.status(500).json({ error: 'Erreur lors de la création du cours.' });
    }
  },

  async update(req, res) {
    try {
      const course = await Course.update(req.params.id, req.user.id, req.body);
      if (!course) {
        return res.status(404).json({ error: 'Cours non trouvé.' });
      }
      res.json(course);
    } catch (error) {
      console.error('Erreur mise à jour cours:', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour du cours.' });
    }
  },

  async delete(req, res) {
    try {
      const success = await Course.delete(req.params.id, req.user.id);
      if (!success) {
        return res.status(404).json({ error: 'Cours non trouvé.' });
      }
      res.json({ message: 'Cours supprimé avec succès.' });
    } catch (error) {
      console.error('Erreur suppression cours:', error);
      res.status(500).json({ error: 'Erreur lors de la suppression du cours.' });
    }
  }
};

module.exports = courseController;
