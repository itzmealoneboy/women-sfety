const redis = require('redis');
const logger = require('../utils/logger');

let redisClient = null;

const initializeRedis = async () => {
    if (!redisClient) {
        try {
            redisClient = redis.createClient({
                url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
                password: process.env.REDIS_PASSWORD || undefined,
                socket: {
                    connectTimeout: 5000, // 5 second timeout
                    lazyConnect: true, // Don't auto-connect
                }
            });

            redisClient.on('error', (err) => {
                // Only log once and suppress repeated connection errors
                if (!redisClient._connectionErrorLogged) {
                    logger.warn('Redis not available - using in-memory storage');
                    redisClient._connectionErrorLogged = true;
                }
            });

            redisClient.on('connect', () => {
                logger.info('Redis connected successfully');
                redisClient._connectionErrorLogged = false; // Reset flag on successful connection
            });

            // Try to connect but don't fail if it doesn't work
            try {
                await redisClient.connect();
            } catch (connectError) {
                logger.warn('Redis connection failed - continuing with in-memory storage');
                redisClient._connectionErrorLogged = true;
            }
        } catch (error) {
            logger.warn('Redis initialization skipped - using in-memory storage');
            // Don't throw error - app can work without Redis
        }
    }
    return redisClient;
};

const getRedisClient = () => {
    if (!redisClient) {
        throw new Error('Redis not initialized');
    }
    return redisClient;
};

const setCache = async (key, value, expirySeconds = 3600) => {
    try {
        if (!redisClient) return null;
        const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
        await redisClient.setEx(key, expirySeconds, stringValue);
        return true;
    } catch (error) {
        logger.error('Redis set cache error:', error);
        return null;
    }
};

const getCache = async (key) => {
    try {
        if (!redisClient) return null;
        const value = await redisClient.get(key);
        if (value) {
            try {
                return JSON.parse(value);
            } catch {
                return value;
            }
        }
        return null;
    } catch (error) {
        logger.error('Redis get cache error:', error);
        return null;
    }
};

const deleteCache = async (pattern) => {
    try {
        if (!redisClient) return null;
        const keys = await redisClient.keys(pattern);
        if (keys.length > 0) {
            await redisClient.del(keys);
        }
        return true;
    } catch (error) {
        logger.error('Redis delete cache error:', error);
        return null;
    }
};

module.exports = {
    initializeRedis,
    getRedisClient,
    setCache,
    getCache,
    deleteCache
};