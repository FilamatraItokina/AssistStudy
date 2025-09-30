// Contrôleur des notes (texte)
const Note = require('../models/Note');

const noteController = {
  async listByCourse(req, res) {
    try {
      const notes = await Note.findByCourseId(req.params.courseId, req.user.id);
      res.json(notes);
    } catch (error) {
      console.error('Erreur liste notes:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des notes.' });
    }
  },

  async create(req, res) {
    try {
      const { courseId, content } = req.body;
      if (!courseId || !content) {
        return res.status(400).json({ error: 'courseId et content sont requis.' });
      }

      const note = await Note.create({
        userId: req.user.id,
        courseId,
        content
      });

      res.status(201).json(note);
    } catch (error) {
      console.error('Erreur création note:', error);
      res.status(500).json({ error: 'Erreur lors de la création de la note.' });
    }
  },

  async update(req, res) {
    try {
      const note = await Note.update(req.params.id, req.user.id, req.body);
      if (!note) {
        return res.status(404).json({ error: 'Note non trouvée.' });
      }
      res.json(note);
    } catch (error) {
      console.error('Erreur mise à jour note:', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour de la note.' });
    }
  },

  async delete(req, res) {
    try {
      const success = await Note.delete(req.params.id, req.user.id);
      if (!success) {
        return res.status(404).json({ error: 'Note non trouvée.' });
      }
      res.json({ message: 'Note supprimée avec succès.' });
    } catch (error) {
      console.error('Erreur suppression note:', error);
      res.status(500).json({ error: 'Erreur lors de la suppression de la note.' });
    }
  }
};

module.exports = noteController;
