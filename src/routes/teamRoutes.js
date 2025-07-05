// backend/src/routes/teamRoutes.js
// Defines API routes for team selection

const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController'); // Import team controller

// POST /api/teams/select
// Route to handle a user selecting their team.
router.post('/select', teamController.selectTeam);

module.exports = router;
