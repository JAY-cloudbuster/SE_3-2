/**
 * @fileoverview Main Server Entry Point for AgriSahayak Backend
 * 
 * This is the primary entry point for the AgriSahayak backend application.
 * It initializes the Express server, connects to MongoDB, configures
 * middleware, mounts API routes, sets up Socket.io for real-time
 * communication, and starts listening for incoming requests.
 * 
 * Architecture Overview:
 * ┌──────────────────────────────────────────────┐
 * │                  HTTP Server                  │
 * │  ┌─────────┐    ┌──────────┐    ┌─────────┐ │
 * │  │  CORS   │ →  │  JSON    │ →  │ Routes  │ │
 * │  │Middleware│    │ Parser   │    │ Handler │ │
 * │  └─────────┘    └──────────┘    └─────────┘ │
 * │                                              │
 * │  ┌──────────────────────────────────────────┐│
 * │  │            Socket.io Server              ││
 * │  │  (Real-time bids, chat, notifications)   ││
 * │  └──────────────────────────────────────────┘│
 * └──────────────────────────────────────────────┘
 * 
 * @module server
 * @requires express - Web application framework
 * @requires dotenv - Environment variable loader
 * @requires cors - Cross-Origin Resource Sharing middleware
 * @requires http - Node.js HTTP server (for Socket.io)
 * @requires socket.io - Real-time bidirectional event-based communication
 * @requires config/db - MongoDB connection function
 */

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { createServer } = require('http');
const { Server } = require('socket.io');

// ============================================================
// 1. ENVIRONMENT CONFIGURATION
// Load environment variables from .env file into process.env
// Variables include: PORT, MONGO_URI, JWT_SECRET, NODE_ENV
// ============================================================
dotenv.config();

// ============================================================
// 2. DATABASE CONNECTION
// Connect to MongoDB using the MONGO_URI from environment variables
// Skipped in test environment (tests manage their own connection)
// ============================================================
if (process.env.NODE_ENV !== 'test') {
    connectDB();
}

// ============================================================
// 3. EXPRESS APP & HTTP SERVER INITIALIZATION
// Create the Express app and wrap it in an HTTP server
// for Socket.io compatibility (Socket.io needs raw HTTP server)
// ============================================================
const app = express();
const httpServer = createServer(app);

// ============================================================
// 4. MIDDLEWARE CONFIGURATION
// These run on every incoming request before reaching routes
// ============================================================

/**
 * CORS Middleware - Enables Cross-Origin Resource Sharing
 * Allows the frontend (running on localhost:5173) to make
 * API requests to this backend (running on localhost:5000)
 */
app.use(cors());

/**
 * JSON Body Parser - Parses incoming request bodies as JSON
 * Populates req.body with the parsed data
 * Required for POST/PUT endpoints that receive JSON payloads
 */
app.use(express.json());

/**
 * URL-Encoded Body Parser - Parses URL-encoded form data
 * extended: false uses the querystring library for parsing
 */
app.use(express.urlencoded({ extended: false }));
// ============================================================
// 4.5 HEALTH CHECK ENDPOINT
// Provides automated monitoring for server and DB status
// ============================================================
const mongoose = require('mongoose');

app.get('/health', async (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    const status = {
        status: dbStatus === 'connected' ? 'UP' : 'DEGRADED',
        uptime: Math.floor(process.uptime()) + 's',
        timestamp: new Date().toISOString(),
        database: dbStatus,
        environment: process.env.NODE_ENV,
        memoryUsage: {
            heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
            rss: Math.round(process.memoryUsage().rss / 1024 / 1024) + 'MB'
        }
    };

    // If DB is down, return 503 so load balancers know the app is struggling
    const statusCode = dbStatus === 'connected' ? 200 : 503;
    res.status(statusCode).json(status);
});
/**
 * Static File Serving - Serves uploaded files (crop images, etc.)
 * Files in the /uploads directory are accessible via /uploads/<filename>
 */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================================
// 5. API ROUTE MOUNTING
// Each route module handles a specific resource/feature area
// The first argument is the URL prefix for all routes in that module
// ============================================================

/**
 * Authentication Routes (/api/auth/*)
 * - POST /api/auth/register - User registration
 * - POST /api/auth/login    - User login & JWT generation
 * @see routes/authRoutes.js
 */
app.use('/api/auth', require('./routes/authRoutes'));

/**
 * Crop Routes (/api/crops/*)
 * - POST /api/crops    - Create new crop listing
 * - GET  /api/crops/my - Get farmer's own listings
 * - GET  /api/crops    - Get all marketplace listings
 * @see routes/cropRoutes.js
 */
app.use('/api/crops', require('./routes/cropRoutes'));

/**
 * Trade Routes (/api/trade/*)
 * - POST /api/trade/bid              - Place bid on auction
 * - POST /api/trade/negotiation/*    - Negotiation endpoints
 * - POST /api/trade/orders           - Create order
 * - GET  /api/trade/orders           - Get user's orders
 * - PUT  /api/trade/orders/:id       - Update order status
 * @see routes/tradeRoutes.js
 */
app.use('/api/trade', require('./routes/tradeRoutes'));

/**
 * Price Routes (/api/prices/*)
 * - GET /api/prices/current   - Current market prices
 * - GET /api/prices/trends    - Historical price trends
 * - GET /api/prices/recommend - Pricing recommendations
 * @see routes/priceRoutes.js
 */
app.use('/api/prices', require('./routes/priceRoutes'));

/**
 * Admin Routes (/api/admin/*)
 * - GET /api/admin/users          - List all users
 * - PUT /api/admin/users/:id/*    - Verify/ban users
 * - GET /api/admin/stats          - Platform statistics
 * @see routes/adminRoutes.js
 */
app.use('/api/admin', require('./routes/adminRoutes'));

/**
 * Decision / AI Routes (/api/decision/*)
 * - GET /api/decision?crop=xxx&state=yyy  - AI recommendation + chart data
 * - GET /api/decision/commodities          - Available crop/state lists
 * @see routes/decisionRoutes.js
 * @see Module 5 - Price Transparency & Decision Support
 */
app.use('/api/decision', require('./routes/decisionRoutes'));

app.use('/api/bidmessage', require('./routes/bidMessageRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// ============================================================
// 6. GLOBAL ERROR HANDLER MIDDLEWARE
// Catches all errors thrown by route handlers and middleware
// Must be defined AFTER all routes (Express error handlers
// are identified by having 4 parameters: err, req, res, next)
// ============================================================

/**
 * Global Error Handler
 * 
 * Formats error responses consistently across all endpoints.
 * In development mode, includes the full stack trace for debugging.
 * In production mode, the stack trace is hidden for security.
 * 
 * @param {Error} err - The error object thrown by a handler
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
app.use((err, req, res, next) => {
    // Use the status code already set by the handler, or default to 500
    // If status is 200 (success), it defaults to 500 for errors
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        statusCode = 400;
    }
    res.status(statusCode);
    res.json({
        message: err.message,
        // Only include stack trace in development for debugging
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

// ============================================================
// 7. SOCKET.IO REAL-TIME SERVER SETUP
// Provides WebSocket-based real-time communication for:
// - Live auction bidding (Epic 4, Story 4.3)
// - Negotiation chat messages (Epic 4, Story 4.4)
// - Real-time order status updates (Epic 4, Story 4.8)
// ============================================================

/**
 * Socket.io Server Instance
 * 
 * Configured with CORS to allow connections from the Vite dev server
 * (running on port 5173). Supports GET and POST methods for the
 * Socket.io handshake and transport.
 * 
 * @see Epic 4, Story 4.3 - Place Bids (real-time bid updates)
 * @see Epic 4, Story 4.4 - Negotiate Price (real-time chat)
 * @see SocketContext.jsx - Frontend Socket.io client provider
 */
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

// Expose io to controllers through req.app.get('io').
app.set('io', io);

const socketHandler = require('./socketHandler');
socketHandler(io);

// ============================================================
// 8. START THE HTTP SERVER
// Listen on the configured port (from .env) or default to 5000
// Uses httpServer (not app) to support both Express AND Socket.io
// ============================================================
module.exports = app;
app.get("/", (req, res) => {
  res.send("SE_3-2 Backend API Running");
});
/** Server port - defaults to 5000 if not specified in environment */
const PORT = process.env.PORT || 5000;

if (require.main === module) {
    httpServer.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}


