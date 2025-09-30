// Routes des notes
const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/course/:courseId', noteController.listByCourse);
router.post('/', noteController.create);
router.put('/:id', noteController.update);
router.delete('/:id', noteController.delete);

module.exports = router;
