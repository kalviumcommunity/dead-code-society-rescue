const mongoose = require('mongoose');

const connectDb = async () => {
    const mongoUrl = process.env.DATABASE_URL;

    if (!mongoUrl) {
        throw new Error('DATABASE_URL is required');
    }

    await mongoose.connect(mongoUrl);
    console.log('Database connected');
};

module.exports = connectDb;
