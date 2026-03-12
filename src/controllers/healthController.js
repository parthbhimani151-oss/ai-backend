import redisService from '../services/redis.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

const getHealth = asyncHandler(async (req, res) => {
    res.json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
    });
});

const pingRedis = asyncHandler(async (req, res) => {
    try {
        const pong = await redisService.ping();

        res.json({
            status: 'ok',
            redis: pong === 'PONG' ? 'connected' : 'error',
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        throw new AppError('Redis connection failed', 500, 'REDIS_ERROR');
    }
});

const getSystemInfo = asyncHandler(async (req, res) => {
    const memoryUsage = process.memoryUsage();

    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        system: {
            uptime: process.uptime(),
            nodeVersion: process.version,
            platform: process.platform,
            arch: process.arch,
        },
        memory: {
            rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
            heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
            heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
            external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,
        },
    });
});

export { getHealth, pingRedis, getSystemInfo };
