// backend/src/config/db.js
// MongoDB connection setup using Mongoose

const mongoose = require('mongoose');

/**
 * Connects to the MongoDB database.
 * The MongoDB URI is fetched from environment variables for security and flexibility.
 */
const connectDB = async () => {
  try {
    // Check if MONGODB_URI is defined in environment variables
    if (!process.env.MONGODB_URI) {
      console.error('Error: MONGODB_URI is not defined in environment variables.');
      process.exit(1); // Exit the process if URI is missing
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // These options are recommended by Mongoose for new connections
      // useNewUrlParser: true, // Deprecated in Mongoose 6.0+
      // useUnifiedTopology: true, // Deprecated in Mongoose 6.0+
      // useCreateIndex: true, // Deprecated in Mongoose 6.0+
      // useFindAndModify: false // Deprecated in Mongoose 6.0+
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
