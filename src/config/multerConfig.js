// backend/src/config/multerConfig.js
const multer = require('multer');

// Configure Multer storage
// We'll use memoryStorage because we're immediately uploading to Cloudinary.
// This avoids saving files to disk unnecessarily.
const storage = multer.memoryStorage();

// Configure Multer upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB (5 * 1024 * 1024 bytes)
  fileFilter: (req, file, cb) => {
    // Only allow image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true); // Accept the file
    } else {
      // Reject the file and provide an error message
      cb(new Error('Only image files are allowed for profile pictures!'), false);
    }
  }
});

module.exports = upload;
