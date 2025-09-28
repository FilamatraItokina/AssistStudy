const router = require("express").Router();
const task = require("../controllers/task.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const subMiddleware = require("../middlewares/subject.middleware");

router.use(authMiddleware);
router.use(subMiddleware);

// Ajouter une nouvelle tâche
router.post("/", task.addTask);

// Lire toutes les tâches
router.get("/", task.readAll);

// Lire les tâches par sujet
router.get("/by-subject", task.readBySubject);

// Lire les tâches par priorité
router.get("/by-priority", task.readByPrio);

// Lire les tâches par priorité dans un sujet
router.get("/by-subject/priority", task.prioInSub);

// Modifier une tâche
router.put("/:id", task.updateTask);

// Supprimer une tâche
router.delete("/:id", task.deleteTask);

module.exports = router;
