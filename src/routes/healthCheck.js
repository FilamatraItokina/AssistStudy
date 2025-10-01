const express = require('express');
const router = express.Router();

/**
 * @route   GET /api/auth/check
 * @desc    Vérifie que l'API est en cours d'exécution
 * @access  Public
 */
router.get('/check', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
