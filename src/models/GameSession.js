// backend/src/models/GameSession.js
const mongoose = require('mongoose');

// Define the GameSession Schema
const GameSessionSchema = new mongoose.Schema({
  // Reference to the User who played this game session
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Refers to the 'User' model
    required: true
  },
  // User's username at the time of the game session (for easier lookup/display)
  username: {
    type: String,
    required: true
  },
  // User's PFP URL at the time of the game session
  pfpUrl: {
    type: String
  },
  // User's team information at the time of the game session
  team: {
    name: {
      type: String
    },
    color: {
      type: String
    }
  },
  // The final score achieved in this game session
  score: {
    type: Number,
    required: true,
    default: 0
  },
  // The question number the user was on when the game ended (e.g., 1-10)
  questionNumber: {
    type: Number,
    required: true,
    min: 0, // 0 if game ended immediately, 1-10 otherwise
    max: 10
  },
  // Boolean flags to indicate how the game session ended
  completed: {
    type: Boolean, // True if user answered all questions correctly (won)
    default: false
  },
  failed: {
    type: Boolean, // True if user answered incorrectly
    default: false
  },
  walkedAway: {
    type: Boolean, // True if user walked away with prize
    default: false
  },
  timeUp: {
    type: Boolean, // True if time ran out
    default: false
  },
  // Status of the game session (e.g., 'in_progress', 'finished', 'game_over', 'walked_away', 'time_up')
  gameStatus: {
    type: String,
    enum: ['in_progress', 'finished', 'game_over', 'walked_away', 'time_up'],
    default: 'in_progress'
  },
  // Timestamp for when the game session started
  startedAt: {
    type: Date,
    default: Date.now
  },
  // Timestamp for when the game session ended (or last updated)
  endedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update the 'endedAt' field on save/update
GameSessionSchema.pre('save', function(next) {
  this.endedAt = Date.now();
  next();
});

GameSessionSchema.pre('findOneAndUpdate', function(next) {
  this._update.endedAt = Date.now();
  next();
});

// Create and export the GameSession model
const GameSession = mongoose.model('GameSession', GameSessionSchema);

module.exports = GameSession;
