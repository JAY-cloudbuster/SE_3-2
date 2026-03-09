/**
 * Main Server Entry Point for AgriSahayak Backend
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
// ============================================================
dotenv.config();

// ============================================================
// 2. DATABASE CONNECTION
// ============================================================
if (process.env.NODE_ENV !== 'test') {
    connectDB();
}

// ============================================================
// 3. EXPRESS APP & HTTP SERVER INITIALIZATION
// ============================================================
const app = express();
const httpServer = createServer(app);

// ============================================================
// 4. MIDDLEWARE CONFIGURATION
// ============================================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================================
// 5. HEALTH CHECK ROUTES (DevOps Monitoring)
// ============================================================

/**
 * Root route
 * Used to quickly verify backend is running
 */
app.get("/", (req, res) => {
    res.send("AgriSahayak Backend API Running");
});

/**
 * Health endpoint
 * Used by monitoring tools and DevOps checks
 */
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "UP",
        message: "Backend service healthy",
        timestamp: new Date()
    });
});

// ============================================================
// 6. API ROUTES
// ============================================================

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/crops', require('./routes/cropRoutes'));
app.use('/api/trade', require('./routes/tradeRoutes'));
app.use('/api/prices', require('./routes/priceRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/decision', require('./routes/decisionRoutes'));

// ============================================================
// 7. GLOBAL ERROR HANDLER
// ============================================================

app.use((err, req, res, next) => {

    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    if (err.name === 'ValidationError') {
        statusCode = 400;
    }

    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

// ============================================================
// 8. SOCKET.IO REAL-TIME SERVER
// ============================================================

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {

    socket.on("join_room", (data) => {
        socket.join(data);
    });

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });

    socket.on("place_bid", (data) => {
        socket.to(data.room).emit("new_bid", data);
    });

    socket.on("negotiation_offer", (data) => {
        socket.to(data.room).emit("new_offer", data);
    });

    socket.on("negotiation_accept", (data) => {
        socket.to(data.room).emit("offer_accepted", data);
    });

    socket.on("order_update", (data) => {
        socket.to(data.room).emit("order_status_changed", data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });

});

// ============================================================
// 9. START SERVER
// ============================================================

module.exports = app;

const PORT = process.env.PORT || 5000;

if (require.main === module) {
    httpServer.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}