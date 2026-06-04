const app = require('./app');
const connectDatabase = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const shipmentRoutes = require('./routes/shipment.routes');
const systemRoutes = require('./routes/system.routes');
const { errorHandler, notFoundMiddleware } = require('./middlewares/error.middleware');

async function bootstrap() {
    await connectDatabase();

    app.use('/api', authRoutes);
    app.use('/api', shipmentRoutes);
    app.use('/api', systemRoutes);
    app.use(notFoundMiddleware);
    app.use(errorHandler);

    const port = process.env.PORT || 3000;

    app.listen(port, () => {
        console.log(`Server is alive on port ${port}`);
        console.log('MongoDB connected and API ready.');
    });
}

bootstrap().catch((error) => {
    console.error('Startup failed:', error);
    process.exit(1);
});

module.exports = app;