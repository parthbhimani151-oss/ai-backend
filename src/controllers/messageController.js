import redisService from '../services/redis.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import logger from '../services/logger.js';

const MESSAGES_KEY = 'messages';
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

const storeMessage = asyncHandler(async (req, res) => {
    const { message } = req.body;

    try {
        const result = await redisService.lPush(MESSAGES_KEY, message);

        logger.info('Message stored', {
            messageLength: message.length,
            totalMessages: result,
        });

        res.status(201).json({
            status: 'success',
            data: {
                message,
                totalMessages: result,
            },
        });
    } catch (error) {
        logger.error('Failed to store message', { error: error.message });
        throw new AppError('Failed to store message', 500, 'STORAGE_ERROR');
    }
});

const getMessages = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(
        parseInt(req.query.limit, 10) || DEFAULT_PAGE_SIZE,
        MAX_PAGE_SIZE
    );

    const start = (page - 1) * limit;
    const stop = start + limit - 1;

    try {
        const messages = await redisService.lRange(MESSAGES_KEY, start, stop);

        res.json({
            status: 'success',
            data: {
                messages,
                pagination: {
                    page,
                    limit,
                    count: messages.length,
                },
            },
        });
    } catch (error) {
        logger.error('Failed to retrieve messages', { error: error.message });
        throw new AppError('Failed to retrieve messages', 500, 'RETRIEVAL_ERROR');
    }
});

const getLatestMessage = asyncHandler(async (req, res) => {
    try {
        const messages = await redisService.lRange(MESSAGES_KEY, 0, 0);

        if (messages.length === 0) {
            throw new AppError('No messages found', 404, 'NOT_FOUND');
        }

        res.json({
            status: 'success',
            data: {
                message: messages[0],
            },
        });
    } catch (error) {
        if (error instanceof AppError) throw error;
        logger.error('Failed to retrieve latest message', { error: error.message });
        throw new AppError('Failed to retrieve latest message', 500, 'RETRIEVAL_ERROR');
    }
});

export { storeMessage, getMessages, getLatestMessage };
