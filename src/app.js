const { app, connectDatabase } = require('./server');

const PORT = process.env.PORT || 3000;

/**
 * Boots the HTTP server after ensuring database connectivity.
 * @returns {Promise<void>} Resolves when server starts.
 */
const start = async () => {
    try {
        await connectDatabase();
        // eslint-disable-next-line no-console
        console.log('--- DATABASE CONNECTED ---');

        app.listen(PORT, () => {
            // eslint-disable-next-line no-console
            console.log(`Server is alive on port ${PORT}`);
        });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('DATABASE CONNECTION ERROR:', error);
        process.exit(1);
    }
};

start();
