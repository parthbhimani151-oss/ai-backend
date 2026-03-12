import express from 'express';
import config from './config/index.js';
import logger from './services/logger.js';
import redisService from './services/redis.js';

import {
    helmetMiddleware,
    corsMiddleware,
    rateLimiter,
    requestLogger,
} from './middleware/security.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

import healthRoutes from './routes/healthRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

const app = express();

// Security middleware
app.use(helmetMiddleware);
app.use(corsMiddleware);

// Rate limiting
app.use(rateLimiter);

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Request logging
app.use(requestLogger);

// API routes
app.use('/api/health', healthRoutes);
app.use('/api/messages', messageRoutes);

// Review endpoint
app.get('/review', (req, res) => {
    res.json({
        status: 'success',
        message: 'successfully passed test',
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        name: 'AI Backend API',
        version: '1.0.0',
        status: 'running',
        documentation: '/api/health',
    });
});

// 404 handler - must be before error handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Graceful shutdown handling
const gracefulShutdown = async (signal) => {
    logger.info(`${signal} received. Starting graceful shutdown...`);

    try {
        await redisService.disconnect();
        logger.info('Redis disconnected successfully');

        process.exit(0);
    } catch (error) {
        logger.error('Error during shutdown', { error: error.message });
        process.exit(1);
    }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection', { reason, promise });
    process.exit(1);
});

// Uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
    process.exit(1);
});

const startServer = async () => {
    try {
        // Connect to Redis
        await redisService.connect();

        // Start server
        const server = app.listen(config.port, () => {
            logger.info(`Server running on port ${config.port}`, {
                port: config.port,
                environment: config.nodeEnv,
            });
        });

        return server;
    } catch (error) {
        logger.error('Failed to start server', { error: error.message });
        process.exit(1);
    }
};

export { app, startServer };
export default app;
