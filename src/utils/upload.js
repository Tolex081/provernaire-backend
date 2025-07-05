// backend/src/utils/upload.js
const cloudinary = require('../config/cloudinaryConfig'); // Import configured Cloudinary instance
const streamifier = require('streamifier'); // NEW: Import streamifier for handling buffers

/**
 * Uploads a file (typically an image) buffer to Cloudinary.
 * This function is designed to work with Multer's memoryStorage,
 * where the file content is available as a buffer (req.file.buffer).
 *
 * @param {Object} file - The file object from multer (e.g., req.file).
 * It should have a 'buffer' property containing the file data.
 * @returns {Promise<string>} A promise that resolves with the secure URL of the uploaded file.
 * @throws {Error} If the upload to Cloudinary fails or no buffer is provided.
 */
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    // Check if file is provided and has a buffer
    if (!file || !file.buffer) {
      return reject(new Error('No file buffer provided for Cloudinary upload.'));
    }

    // Create an upload stream to Cloudinary
    // This is the recommended way to upload buffers to Cloudinary
    let uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'succinct_trivia_pfps', // Specify a folder for profile pictures
        resource_type: 'auto' // Automatically detect file type (image, video, raw)
      },
      (error, result) => {
        if (result) {
          // If upload is successful, resolve the promise with the secure URL
          return resolve(result.secure_url);
        } else {
          // If there's an error during upload, reject the promise
          return reject(new Error(`Cloudinary upload failed: ${error.message}`));
        }
      }
    );

    // Create a readable stream from the file buffer and pipe it to the Cloudinary upload stream
    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

module.exports = uploadToCloudinary;
