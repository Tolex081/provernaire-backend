// backend/src/controllers/scoreController.js
const GameSession = require('../models/GameSession'); // Import the GameSession model
const User = require('../models/User'); // Import the User model

/**
 * Updates a user's game session score and status.
 * This function handles both creating a new session (if none exists for the user in progress)
 * or updating an existing one. It also ensures the latest user info (pfp, team) is used.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.updateGameScore = async (req, res) => {
  const {
    userId,
    username,
    pfpUrl,
    team,
    score,
    questionNumber,
    completed,
    failed,
    walkedAway,
    timeUp,
    gameStatus
  } = req.body;

  // Basic validation
  if (!userId || !username || score === undefined || questionNumber === undefined) {
    return res.status(400).json({ success: false, message: 'Missing required game session data.' });
  }

  try {
    // Find the user to ensure they exist and get their latest PFP/team info
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Determine if there's an ongoing game session for this user
    // A session is considered 'in_progress' if its gameStatus is explicitly 'in_progress'
    let gameSession = await GameSession.findOne({
      user: userId,
      gameStatus: 'in_progress'
    });

    if (gameSession) {
      // Update existing session
      gameSession.score = score;
      gameSession.questionNumber = questionNumber;
      gameSession.completed = completed || gameSession.completed;
      gameSession.failed = failed || gameSession.failed;
      gameSession.walkedAway = walkedAway || gameSession.walkedAway;
      gameSession.timeUp = timeUp || gameSession.timeUp;
      gameSession.gameStatus = gameStatus;
      // Ensure username, pfpUrl, and team are updated in case they changed
      gameSession.username = username;
      gameSession.pfpUrl = pfpUrl;
      gameSession.team = team; // Update entire team object
      await gameSession.save();
      console.log(`Game session updated for user '${username}'. Score: ${score}`);
    } else {
      // Create a new game session
      gameSession = await GameSession.create({
        user: userId,
        username,
        pfpUrl: pfpUrl || user.pfpUrl, // Use provided pfpUrl or user's current pfpUrl
        team: team || user.team, // Use provided team or user's current team
        score,
        questionNumber,
        completed,
        failed,
        walkedAway,
        timeUp,
        gameStatus,
        startedAt: Date.now()
      });
      console.log(`New game session created for user '${username}'. Score: ${score}`);
    }

    res.status(200).json({ success: true, message: 'Game score updated successfully.', gameSession });
  } catch (error) {
    console.error('Error updating game score:', error);
    res.status(500).json({ success: false, message: 'Server error updating game score.', error: error.message });
  }
};

/**
 * Fetches leaderboard data.
 * Returns a list of all unique players with their highest scores.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.getLeaderboard = async (req, res) => {
  try {
    // Aggregate to get the latest (or highest score) for each user
    const leaderboard = await GameSession.aggregate([
      // Group by user to get the latest session for each user
      {
        $sort: { score: -1, endedAt: -1 } // Sort by score descending, then by latest session
      },
      {
        $group: {
          _id: '$user', // Group by user ID
          latestSessionId: { $first: '$_id' }, // Get the ID of the top session for this user
          username: { $first: '$username' },
          pfpUrl: { $first: '$pfpUrl' },
          team: { $first: '$team' },
          score: { $first: '$score' },
          questionNumber: { $first: '$questionNumber' },
          completed: { $first: '$completed' },
          failed: { $first: '$failed' },
          walkedAway: { $first: '$walkedAway' },
          timeUp: { $first: '$timeUp' },
          gameStatus: { $first: '$gameStatus' },
          endedAt: { $first: '$endedAt' }
        }
      },
      // Project to reshape the output and include the _id as userId
      {
        $project: {
          _id: 0, // Exclude default _id
          userId: '$_id', // Rename _id to userId
          username: 1,
          pfpUrl: 1,
          team: 1,
          score: 1,
          questionNumber: 1,
          completed: 1,
          failed: 1,
          walkedAway: 1,
          timeUp: 1,
          gameStatus: 1,
          timestamp: '$endedAt' // Use endedAt as timestamp for consistency
        }
      },
      // Sort the final leaderboard by score descending
      {
        $sort: { score: -1, timestamp: -1 }
      }
    ]);

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ success: false, message: 'Server error fetching leaderboard.', error: error.message });
  }
};
