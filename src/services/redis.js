import { createClient } from 'redis';
import config from '../config/index.js';
import logger from './logger.js';

class RedisService {
    constructor() {
        this.client = null;
        this.isConnected = false;
    }

    async connect() {
        try {
            this.client = createClient({
                url: config.redis.url,
            });

            this.client.on('error', (err) => {
                logger.error('Redis Client Error', { error: err.message });
            });

            this.client.on('connect', () => {
                logger.info('Redis client connected');
            });

            this.client.on('reconnecting', () => {
                logger.warn('Redis client reconnecting');
            });

            await this.client.connect();
            this.isConnected = true;

            logger.info('Redis connection established successfully');
        } catch (error) {
            logger.error('Failed to connect to Redis', { error: error.message });
            throw error;
        }
    }

    async disconnect() {
        if (this.client) {
            await this.client.quit();
            this.isConnected = false;
            logger.info('Redis connection closed');
        }
    }

    async ping() {
        this.checkConnection();
        return await this.client.ping();
    }

    async lPush(key, value) {
        this.checkConnection();
        return await this.client.lPush(key, value);
    }

    async lRange(key, start, stop) {
        this.checkConnection();
        return await this.client.lRange(key, start, stop);
    }

    checkConnection() {
        if (!this.isConnected || !this.client) {
            throw new Error('Redis client is not connected');
        }
    }
}

const redisService = new RedisService();

export default redisService;
