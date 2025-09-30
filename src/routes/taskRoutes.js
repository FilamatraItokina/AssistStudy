// Routes des tâches
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticateToken } = require('../middleware/auth');

// Toutes les routes nécessitent l'authentification
router.use(authenticateToken);

router.get('/', taskController.list);
router.get('/:id', taskController.get);
router.post('/', taskController.create);
router.put('/:id', taskController.update);
router.delete('/:id', taskController.delete);

module.exports = router;
