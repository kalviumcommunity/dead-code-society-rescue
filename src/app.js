const dns = require('node:dns');
dns.setServers(['1.1.1.1', '8.8.8.8']); 
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const routes = require("./routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error(err));

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "LogiTrack API Running"
    });
});

app.use("/api", routes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found"
    });
});

// Global Error Handler
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;