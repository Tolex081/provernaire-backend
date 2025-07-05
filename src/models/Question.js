// backend/src/models/Question.js
const mongoose = require('mongoose');

// Define the Question Schema
const QuestionSchema = new mongoose.Schema({
  // The text of the question
  question: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true,
    unique: true // Ensures no duplicate questions
  },
  // An array of possible answer options
  options: {
    type: [String], // Array of strings
    required: [true, 'Options are required'],
    validate: {
      validator: function(v) {
        // Ensure there are exactly 4 options
        return v.length === 4;
      },
      message: props => `${props.value.length} options provided, but exactly 4 are required.`
    }
  },
  // The index of the correct answer in the options array (0-indexed)
  correctAnswer: {
    type: Number,
    required: [true, 'Correct answer index is required'],
    min: [0, 'Correct answer index must be at least 0'],
    max: [3, 'Correct answer index must be at most 3']
  },
  // Category of the question (optional, for filtering/organizing)
  category: {
    type: String,
    trim: true,
    default: 'General Knowledge'
  },
  // Difficulty level (optional)
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create and export the Question model
const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;
