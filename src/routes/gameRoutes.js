// backend/src/routes/gameRoutes.js
const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController'); // Import game controller

// GET /api/game/questions
// Route to fetch a specified number of random questions for the game
router.get('/questions', gameController.getGameQuestions);

module.exports = router;
