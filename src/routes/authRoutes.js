// backend/src/routes/authRoutes.js
// Defines API routes for user authentication

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Import auth controller
const upload = require('../config/multerConfig'); // NEW: Import the configured multer middleware

// POST /api/auth/register
// This route handles both registration and login based on username existence.
// 'upload.single('profilePicture')' middleware processes the 'profilePicture' field from the form.
router.post('/register', upload.single('profilePicture'), authController.registerOrLoginUser);

module.exports = router;
