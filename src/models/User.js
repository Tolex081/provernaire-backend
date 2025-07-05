// backend/src/models/User.js
const mongoose = require('mongoose');

// Define the User Schema
const UserSchema = new mongoose.Schema({
  // Unique username for the user, required
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true, // Ensures no two users have the same username
    trim: true, // Removes whitespace from both ends of a string
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  // URL to the user's profile picture (PFP)
  pfpUrl: {
    type: String,
    default: 'https://placehold.co/150x150/cccccc/000000?text=PFP' // Default PFP if none is provided
  },
  // Embedded document for team information
  team: {
    name: {
      type: String,
      trim: true
    },
    color: {
      type: String, // Store team color as a hex string (e.g., '#FF5733')
      trim: true
    }
  },
  // Timestamp for when the user was created
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Timestamp for the last update
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update the 'updatedAt' field on save
UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create and export the User model
const User = mongoose.model('User', UserSchema);

module.exports = User;
