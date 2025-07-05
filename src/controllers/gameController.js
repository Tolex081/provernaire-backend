// backend/src/controllers/gameController.js
const Question = require('../models/Question'); // Import the Question model

/**
 * Fetches a specified number of random questions for the game.
 * This controller is specifically for the game's question fetching.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.getGameQuestions = async (req, res) => {
  // Default to 10 questions if 'limit' is not provided or invalid
  const limit = parseInt(req.query.limit) || 10;

  try {
    // Use aggregation pipeline to get random questions
    const questions = await Question.aggregate([
      { $sample: { size: limit } } // $sample operator randomly selects documents
    ]);

    if (questions.length === 0) {
      return res.status(404).json({ success: false, message: 'No questions found in the database.' });
    }

    // For security, you might want to omit the correctAnswer from the response
    // if this endpoint is directly consumed by the frontend game logic.
    // However, for this project, we'll send it as the frontend needs it for validation.
    res.status(200).json({ success: true, questions });
  } catch (error) {
    console.error('Error fetching game questions:', error);
    res.status(500).json({ success: false, message: 'Server error fetching game questions.', error: error.message });
  }
};
