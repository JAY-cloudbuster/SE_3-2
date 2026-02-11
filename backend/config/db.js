/**
 * @fileoverview MongoDB Database Connection Module for AgriSahayak Platform
 * 
 * This module establishes and manages the connection to the MongoDB database
 * using Mongoose ODM (Object Data Modeling). It reads the connection string
 * from the MONGO_URI environment variable (defined in .env file).
 * 
 * The connection is established once at server startup (called from server.js)
 * and maintained throughout the application lifecycle. If the connection fails,
 * the process exits with code 1 to prevent the server from running without
 * database access.
 * 
 * @module config/db
 * @requires mongoose - MongoDB object modeling tool for Node.js
 * @requires colors - Terminal string styling for colored console output
 */

const mongoose = require('mongoose');
const colors = require('colors');

/**
 * Connect to MongoDB Database
 * 
 * An async function that establishes a connection to MongoDB using
 * the connection URI from environment variables. Uses Mongoose's
 * built-in connection pooling and automatic reconnection.
 * 
 * On success: Logs the connected host in cyan (e.g., "MongoDB Connected: cluster0.xxxxx.mongodb.net")
 * On failure: Logs the error in red and terminates the process (exit code 1)
 * 
 * @async
 * @function connectDB
 * @returns {Promise<void>}
 * @throws {Error} Exits process with code 1 if connection fails
 * 
 * @example
 * // Called in server.js at startup
 * const connectDB = require('./config/db');
 * connectDB();
 */
const connectDB = async () => {
    try {
        // Attempt to connect to MongoDB using the URI from environment variables
        // Mongoose 7.x+ handles useNewUrlParser and useUnifiedTopology automatically
        const conn = await mongoose.connect(process.env.MONGO_URI);

        // Log successful connection with the host name (colored cyan for visibility)
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
    } catch (error) {
        // Log the error message in red and terminate the process
        // Exit code 1 indicates an error condition
        console.log(`Error: ${error.message}`.red.bold);
        process.exit(1);
    }
};

// Export the connection function for use in server.js
module.exports = connectDB;
