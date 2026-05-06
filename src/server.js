require('dotenv').config();

const mongoose = require('mongoose');
const app = require('./app');

async function start() {
    const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/logitrack';
    const port = process.env.PORT || 3000;

    try {
        await mongoose.connect(mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('--- DATABASE CONNECTED ---');

        app.listen(port, () => {
            console.log(`Server is alive on port ${port}`);
        });
    } catch (error) {
        console.error('DATABASE CONNECTION ERROR:');
        console.error(error);
        process.exitCode = 1;
    }
}

start();

module.exports = app;