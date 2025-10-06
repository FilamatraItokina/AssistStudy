// Routes Paramètres
const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settingsController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.post("/reset", authenticateToken, settingsController.resetData);

module.exports = router;
