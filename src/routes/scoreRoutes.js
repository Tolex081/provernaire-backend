// backend/src/routes/scoreRoutes.js
const express = require('express');
const router = express.Router();
const scoreController = require('../controllers/scoreController'); // Import score controller

// POST /api/scores/update
// Route to update a user's game score and session status
router.post('/update', scoreController.updateGameScore);

// GET /api/scores/leaderboard
// Route to fetch the overall leaderboard data
router.get('/leaderboard', scoreController.getLeaderboard);

module.exports = router;
