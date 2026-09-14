import { createClient } from 'redis';

// Create a robust Redis client with connection error handling
const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Connected to Redis Server'));

// Connect to Redis immediately when the server starts
await redisClient.connect();

class RedisCache {
    /**
     * Set a value in the cache with a Time-To-Live (TTL)
     * @param {string} key - The cache key (e.g., 'all_products')
     * @param {any} value - The data to cache
     * @param {number} expirationInSeconds - Time before cache expires
     */
    async set(key, value, expirationInSeconds = 300) { // Default 5 minutes
        try {
            // Redis stores strings, so we must stringify our JSON objects
            await redisClient.setEx(key, expirationInSeconds, JSON.stringify(value));
        } catch (error) {
            console.error(`Cache SET Error for key ${key}:`, error);
        }
    }

    /**
     * Get a value from the cache
     * @param {string} key - The cache key
     * @returns {any|null} - Parsed JSON object or null if cache miss
     */
    async get(key) {
        try {
            const data = await redisClient.get(key);
            if (data) {
                console.log(`Cache Hit: ${key}`);
                return JSON.parse(data);
            }
            console.log(`Cache Miss: ${key}`);
            return null;
        } catch (error) {
            console.error(`Cache GET Error for key ${key}:`, error);
            return null; // Fallback to DB if Redis fails
        }
    }

    /**
     * Delete a specific key from the cache (Cache Invalidation)
     */
    async del(key) {
        try {
            await redisClient.del(key);
            console.log(`Cache Invalidated: ${key}`);
        } catch (error) {
            console.error(`Cache DEL Error for key ${key}:`, error);
        }
    }
}

export const productCache = new RedisCache();
export default RedisCache;
