/**
 * Main Server Entry Point for AgriSahayak Backend
 */

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

dotenv.config();

/* ============================================================
   DATABASE CONNECTION
============================================================ */

if (process.env.NODE_ENV !== "test") {
  connectDB().then(() => {
    const seedAdmin = require("./scripts/seedAdmin");
    seedAdmin();
  });
}

/* ============================================================
   EXPRESS APP INITIALIZATION
============================================================ */

const app = express();

/* ============================================================
   CORS CONFIGURATION
============================================================ */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://se-3-2.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow server-to-server requests or Postman
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        origin.startsWith("http://localhost:")
      ) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ============================================================
   BODY PARSERS
============================================================ */

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* ============================================================
   HEALTH CHECK
============================================================ */

app.get("/health", async (req, res) => {
  const dbStatus =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";

  const status = {
    status: dbStatus === "connected" ? "UP" : "DEGRADED",
    version: "v2",
    uptime: Math.floor(process.uptime()) + "s",
    timestamp: new Date().toISOString(),
    database: dbStatus,
    environment: process.env.NODE_ENV,
    memoryUsage: {
      heapUsed:
        Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + "MB",
      rss: Math.round(process.memoryUsage().rss / 1024 / 1024) + "MB",
    },
  };

  const statusCode = dbStatus === "connected" ? 200 : 503;
  res.status(statusCode).json(status);
});

/* ============================================================
   STATIC FILES
============================================================ */

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ============================================================
   API ROUTES
============================================================ */

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/crops", require("./routes/cropRoutes"));
app.use("/api/trade", require("./routes/tradeRoutes"));
app.use("/api/prices", require("./routes/priceRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/decision", require("./routes/decisionRoutes"));

app.use("/api/bids", require("./routes/bidRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/user", require("./routes/profileRoutes"));
app.use("/api/ratings", require("./routes/ratingRoutes"));

/* ============================================================
   ROOT ROUTE
============================================================ */

app.get("/", (req, res) => {
  res.send("SE_3-2 Backend API Running");
});

/* ============================================================
   GLOBAL ERROR HANDLER
============================================================ */

app.use((err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  if (err.name === "ValidationError") {
    statusCode = 400;
  }

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

/* ============================================================
   SERVER START
============================================================ */

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;