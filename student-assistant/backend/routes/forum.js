// Routes Forum
const express = require("express");
const router = express.Router();
const forumController = require("../controllers/forumController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.get("/", forumController.getQuestions);
router.post("/", authenticateToken, forumController.postQuestion);
router.post("/answer", authenticateToken, forumController.postAnswer);
router.get("/:id/answers", forumController.getAnswers);
router.delete("/:id", authenticateToken, forumController.deleteMessage);

module.exports = router;
