require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const routes = require("./routes");
const { NotFoundError } = require("./utils/errors.util");
const { errorMiddleware } = require("./middlewares/error.middleware");

const app = express();

// middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// database connection
const mongoUrl =
  process.env.DATABASE_URL || "mongodb://localhost:27017/logitrack";
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

async function connectDatabase() {
  try {
    await mongoose.connect(mongoUrl, mongoOptions);
    console.log("--- DATABASE CONNECTED ---");
  } catch (err) {
    console.log("DATABASE CONNECTION ERROR:");
    console.log(err);
  }
}

// register routes
app.use("/api", routes); // all routes under /api

// welcome route
app.get("/", function (req, res) {
  res.json({ message: "LogiTrack Backend running" });
});

app.use("/api", routes);

app.use(function (req, res, next) {
  next(new NotFoundError("Route not found"));
});

app.use(errorMiddleware);

// start server
const PORT = process.env.PORT || 3000;
connectDatabase();
app.listen(PORT, function () {
  console.log("Server is alive on port " + PORT);
  console.log("Wait for MongoDB before testing...");
});

// exporting for testing later
module.exports = app;
