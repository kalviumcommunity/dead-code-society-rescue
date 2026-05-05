require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const errorHandler = require('./middlewares/error.middleware');

// Database connection
const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/logitrack';

const startServer = async () => {
  try {
    // Register centralized error middleware as the final middleware.
    app.use(errorHandler);

    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected successfully');

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

startServer();
