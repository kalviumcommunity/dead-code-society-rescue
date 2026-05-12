require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// Import routes
const authRoutes = require("./routes/authRoutes");
const shipmentRoutes = require("./routes/shipmentRoutes");
const healthRoutes = require("./routes/healthRoutes");

// Import middlewares
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Database connection with proper async/await and error handling
 */
async function connectDatabase() {
  try {
    const mongoUrl =
      process.env.DATABASE_URL || "mongodb://localhost:27017/logitrack";
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("✓ DATABASE CONNECTED");
  } catch (err) {
    console.error("✗ DATABASE CONNECTION ERROR:", err.message);
    process.exit(1); // Exit if DB connection fails
  }
}

// Connect to database
connectDatabase();

// Root route
app.get("/", (req, res) => {
  res.json({ message: "LogiTrack Backend running" });
});

// Register route modules
app.use("/api/auth", authRoutes);
app.use("/api/shipments", shipmentRoutes);
app.use("/api", healthRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// Global error handler middleware (must be last)
app.use(errorHandler);

/**
 * Start server with proper error handling
 */
async function startServer() {
  try {
    const PORT = process.env.PORT || 3000;
    const server = app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
    });

    // Handle server errors
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(`✗ Port ${PORT} is already in use`);
      } else {
        console.error("✗ Server error:", err.message);
      }
      process.exit(1);
    });
  } catch (err) {
    console.error("✗ Failed to start server:", err.message);
    process.exit(1);
  }
}

// Start the server
startServer();

module.exports = app;
