// backend/src/controllers/questionController.js
const Question = require('../models/Question'); // Import the Question model

/**
 * Adds a new question to the database.
 * This is useful for populating your question bank.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.addQuestion = async (req, res) => {
  const { question, options, correctAnswer, category, difficulty } = req.body;

  // Basic validation
  if (!question || !options || correctAnswer === undefined) {
    return res.status(400).json({ success: false, message: 'Question, options, and correct answer are required.' });
  }
  if (!Array.isArray(options) || options.length !== 4) {
    return res.status(400).json({ success: false, message: 'Options must be an array of exactly 4 strings.' });
  }
  if (correctAnswer < 0 || correctAnswer > 3) {
    return res.status(400).json({ success: false, message: 'Correct answer index must be between 0 and 3.' });
  }

  try {
    const newQuestion = await Question.create({
      question,
      options,
      correctAnswer,
      category,
      difficulty
    });
    console.log(`New question added: '${question}'`);
    res.status(201).json({ success: true, message: 'Question added successfully!', question: newQuestion });
  } catch (error) {
    console.error('Error adding question:', error);
    if (error.code === 11000) { // Duplicate key error
      return res.status(409).json({ success: false, message: 'A question with this text already exists.' });
    }
    res.status(500).json({ success: false, message: 'Server error adding question.', error: error.message });
  }
};

/**
 * Fetches a specified number of random questions from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.getQuestions = async (req, res) => {
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

    res.status(200).json({ success: true, questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ success: false, message: 'Server error fetching questions.', error: error.message });
  }
};

/**
 * Gets a single question by its ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found.' });
    }
    res.status(200).json({ success: true, question });
  } catch (error) {
    console.error('Error fetching question by ID:', error);
    res.status(500).json({ success: false, message: 'Server error fetching question.', error: error.message });
  }
};

/**
 * Updates an existing question by its ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedQuestion = await Question.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedQuestion) {
      return res.status(404).json({ success: false, message: 'Question not found.' });
    }
    res.status(200).json({ success: true, message: 'Question updated successfully!', question: updatedQuestion });
  } catch (error) {
    console.error('Error updating question:', error);
    if (error.code === 11000) { // Duplicate key error
      return res.status(409).json({ success: false, message: 'A question with this text already exists.' });
    }
    res.status(500).json({ success: false, message: 'Server error updating question.', error: error.message });
  }
};

/**
 * Deletes a question by its ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuestion = await Question.findByIdAndDelete(id);
    if (!deletedQuestion) {
      return res.status(404).json({ success: false, message: 'Question not found.' });
    }
    res.status(200).json({ success: true, message: 'Question deleted successfully!' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ success: false, message: 'Server error deleting question.', error: error.message });
  }
};
