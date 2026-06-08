require('dotenv').config();

const app = require('./app');
const connectDb = require('./config/db');

const PORT = Number(process.env.PORT) || 3000;

connectDb()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is alive on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    });
