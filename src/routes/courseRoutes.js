// Routes des cours
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', courseController.list);
router.get('/:id', courseController.get);
router.post('/', courseController.create);
router.put('/:id', courseController.update);
router.delete('/:id', courseController.delete);

module.exports = router;
