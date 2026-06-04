const mongoose = require('mongoose');

/**
 * Connects the application to MongoDB.
 * @returns {Promise<typeof mongoose>} The active Mongoose connection promise.
 */
async function connectDatabase() {
    const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/logitrack';

    if (!mongoUrl) {
        throw new Error('DATABASE_URL is required');
    }

    await mongoose.connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    });

    return mongoose;
}

module.exports = connectDatabase;