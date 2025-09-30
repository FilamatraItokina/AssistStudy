// Contrôleur des tâches
const Task = require('../models/Task');

const taskController = {
  // Liste des tâches
  async list(req, res) {
    try {
      const filters = {};
      if (req.query.priority) filters.priority = req.query.priority;
      if (req.query.completed !== undefined) filters.completed = req.query.completed === 'true';

      const tasks = await Task.findByUserId(req.user.id, filters);
      res.json(tasks);
    } catch (error) {
      console.error('Erreur liste tâches:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des tâches.' });
    }
  },

  // Détail d'une tâche
  async get(req, res) {
    try {
      const task = await Task.findById(req.params.id, req.user.id);
      if (!task) {
        return res.status(404).json({ error: 'Tâche non trouvée.' });
      }
      res.json(task);
    } catch (error) {
      console.error('Erreur détail tâche:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération de la tâche.' });
    }
  },

  // Créer une tâche
  async create(req, res) {
    try {
      const { title, description, priority, deadline } = req.body;
      if (!title) {
        return res.status(400).json({ error: 'Le titre est requis.' });
      }

      const task = await Task.create({
        userId: req.user.id,
        title,
        description,
        priority,
        deadline
      });

      res.status(201).json(task);
    } catch (error) {
      console.error('Erreur création tâche:', error);
      res.status(500).json({ error: 'Erreur lors de la création de la tâche.' });
    }
  },

  // Mettre à jour
  async update(req, res) {
    try {
      const task = await Task.update(req.params.id, req.user.id, req.body);
      if (!task) {
        return res.status(404).json({ error: 'Tâche non trouvée.' });
      }
      res.json(task);
    } catch (error) {
      console.error('Erreur mise à jour tâche:', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour de la tâche.' });
    }
  },

  // Supprimer
  async delete(req, res) {
    try {
      const success = await Task.delete(req.params.id, req.user.id);
      if (!success) {
        return res.status(404).json({ error: 'Tâche non trouvée.' });
      }
      res.json({ message: 'Tâche supprimée avec succès.' });
    } catch (error) {
      console.error('Erreur suppression tâche:', error);
      res.status(500).json({ error: 'Erreur lors de la suppression de la tâche.' });
    }
  }
};

module.exports = taskController;
