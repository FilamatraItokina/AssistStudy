// Routes Progression
const express = require("express");
const router = express.Router();
const progressController = require("../controllers/progressController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.get("/", authenticateToken, progressController.getProgress);
router.put("/goal", authenticateToken, progressController.setWeeklyGoal);

module.exports = router;
