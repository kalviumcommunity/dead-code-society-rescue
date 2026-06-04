require('dotenv').config();

const mongoose = require('mongoose');

const app = require('./server');

const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/logitrack';
const port = process.env.PORT || 3000;

async function startServer() {
    try {
        await mongoose.connect(mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('--- DATABASE CONNECTED ---');

        app.listen(port, function() {
            console.log('Server is alive on port ' + port);
        });
    } catch (error) {
        console.log('DATABASE CONNECTION ERROR:');
        console.log(error);
        process.exitCode = 1;
    }
}

if (require.main === module) {
    startServer();
}

module.exports = app;
