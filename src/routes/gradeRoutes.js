// Routes des notes d'examens
const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/averages', gradeController.getAverages);
router.get('/course/:courseId', gradeController.listByCourse);
router.post('/', gradeController.create);
router.put('/:id', gradeController.update);
router.delete('/:id', gradeController.delete);

module.exports = router;
