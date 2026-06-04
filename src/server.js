require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 3000;
const mongoUrl =
  process.env.DATABASE_URL || 'mongodb://localhost:27017/logitrack';

const start = async () => {
  try {
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('--- DATABASE CONNECTED ---');

    app.listen(PORT, () => {
      console.log(`Server is alive on port ${PORT}`);
    });
  } catch (err) {
    console.error('DATABASE CONNECTION ERROR:', err);
    process.exit(1);
  }
};

start();
