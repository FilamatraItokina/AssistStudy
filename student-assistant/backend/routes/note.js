// Routes Notes
const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.get("/", authenticateToken, noteController.getNotes);
router.post("/", authenticateToken, noteController.createNote);
router.put("/:id", authenticateToken, noteController.updateNote);
router.delete("/:id", authenticateToken, noteController.deleteNote);

module.exports = router;
