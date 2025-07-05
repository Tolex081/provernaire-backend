// backend/src/controllers/authController.js
const User = require('../models/User'); // Import the User model
const uploadToCloudinary = require('../utils/upload'); // Import the Cloudinary upload utility (to be created)

/**
 * Handles user registration or login.
 * If a user with the given username exists, it acts as a login.
 * If not, it registers a new user.
 * Also handles profile picture (PFP) upload to Cloudinary.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.registerOrLoginUser = async (req, res) => {
  const { username } = req.body;
  const profilePictureFile = req.file; // This comes from multer middleware

  if (!username) {
    return res.status(400).json({ success: false, message: 'Username is required.' });
  }

  try {
    let user = await User.findOne({ username });

    if (user) {
      // User exists, act as login
      console.log(`User '${username}' logged in.`);
      // Optionally update PFP if a new one is provided during "login"
      if (profilePictureFile) {
        const pfpUrl = await uploadToCloudinary(profilePictureFile);
        user.pfpUrl = pfpUrl;
        await user.save();
        console.log(`User '${username}' PFP updated.`);
      }
      return res.status(200).json({ success: true, message: 'Login successful!', user });
    } else {
      // User does not exist, register new user
      let pfpUrl = 'https://placehold.co/150x150/cccccc/000000?text=PFP'; // Default PFP

      if (profilePictureFile) {
        // Upload PFP to Cloudinary if provided
        pfpUrl = await uploadToCloudinary(profilePictureFile);
        console.log(`PFP uploaded for new user '${username}': ${pfpUrl}`);
      }

      user = await User.create({
        username,
        pfpUrl,
        // Default team can be null or an empty object initially
        team: {}
      });
      console.log(`New user '${username}' registered.`);
      return res.status(201).json({ success: true, message: 'Registration successful!', user });
    }
  } catch (error) {
    console.error('Error in registerOrLoginUser:', error);
    // Handle duplicate key error for username specifically
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Username already taken.' });
    }
    return res.status(500).json({ success: false, message: 'Server error during authentication.', error: error.message });
  }
};
