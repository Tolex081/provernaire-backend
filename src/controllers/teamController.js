// backend/src/controllers/teamController.js
// Logic for handling team selection

const User = require('../models/User'); // Import the User model

/**
 * Updates a user's selected team.
 * Implements the logic: if a user already has a team, they must re-select it.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.selectTeam = async (req, res) => {
  const { userId, teamName } = req.body; // Expect userId and teamName from the frontend

  console.log(`Attempting to select team: userId=${userId}, teamName=${teamName}`); // Added logging

  if (!userId || !teamName) {
    console.error('Validation Error: User ID or team name is missing.'); // Added logging
    return res.status(400).json({ success: false, message: 'User ID and team name are required.' });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      console.error(`User Not Found: No user found with ID ${userId}.`); // Added logging
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Logic: If user already has a team and tries to select a different one, prevent it.
    // Ensure user.team and user.team.name exist before comparing
    if (user.team && user.team.name && user.team.name !== teamName) {
      console.log(`Team Locked: User ${user.username} (ID: ${userId}) tried to change from ${user.team.name} to ${teamName}.`); // Added logging
      return res.status(403).json({
        success: false,
        message: `You have already selected the ${user.team.name} team and cannot change it. Please re-select it to proceed.`,
      });
    }

    // If no team is selected or the same team is re-selected, update the team.
    // Ensure the team object is correctly set
    user.team = { name: teamName }; // Store the team name as an object
    user.lastLogin = Date.now(); // Update last login time on team selection as well

    await user.save();
    console.log(`Team Selected: User ${user.username} (ID: ${userId}) successfully selected team ${teamName}.`); // Added logging

    res.status(200).json({
      success: true,
      message: `Team "${teamName}" selected successfully!`,
      user: {
        id: user._id,
        username: user.username,
        pfpUrl: user.pfpUrl,
        team: user.team, // Return the updated team object
        totalScore: user.totalScore, // Ensure totalScore is returned if it exists on the user model
      },
    });

  } catch (error) {
    console.error('Server Error in selectTeam:', error); // Detailed error logging
    res.status(500).json({ success: false, message: 'Server error during team selection.' });
  }
};
