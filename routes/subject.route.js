const router = require('express').Router();
const authMiddleware = require('../middlewares/auth.middleware');
const sub = require('../controllers/subject.controller');

router.use(authMiddleware);

//Ajouter
router.post('/', sub.addSub);

//Lire
router.get('/', sub.readAll);

//Modifier
router.put('/:id', sub.update);

//Supprimer
router.delete('/:id', sub.delete);

module.exports = router;