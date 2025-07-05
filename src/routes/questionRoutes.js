// backend/src/routes/questionRoutes.js
const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController'); // Import question controller

// POST /api/questions/add
// Route to add a new question (for populating the database)
router.post('/add', questionController.addQuestion);

// GET /api/questions
// Route to fetch a specified number of random questions for the game
router.get('/', questionController.getQuestions);

// GET /api/questions/:id
// Route to get a single question by ID
router.get('/:id', questionController.getQuestionById);

// PUT /api/questions/:id
// Route to update a question by ID
router.put('/:id', questionController.updateQuestion);

// DELETE /api/questions/:id
// Route to delete a question by ID
router.delete('/:id', questionController.deleteQuestion);

module.exports = router;
