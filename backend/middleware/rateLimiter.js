import { createClient } from 'redis';

// We create a separate Redis client for the rate limiter
const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.error('Redis Rate Limiter Error', err));
await redisClient.connect();

/**
 * Fixed Window Rate Limiter Algorithm using Redis
 * @param {number} maxRequests - Max allowed requests in the time window
 * @param {number} windowSeconds - Time window in seconds (e.g., 60 for 1 minute)
 */
export const loginRateLimiter = (maxRequests = 5, windowSeconds = 60) => {
    return async (req, res, next) => {
        try {
            // We use the user's IP address as the unique identifier
            // In a real app behind a load balancer, use req.headers['x-forwarded-for']
            const ip = req.ip || req.connection.remoteAddress;
            const key = `rate_limit:login:${ip}`;

            // Increment the counter for this IP in Redis
            const currentRequests = await redisClient.incr(key);

            // If this is the very first request, set the expiration timer (the "window")
            if (currentRequests === 1) {
                await redisClient.expire(key, windowSeconds);
            }

            // Check if they exceeded the limit
            if (currentRequests > maxRequests) {
                return res.status(429).json({
                    success: false,
                    message: `Too many login attempts. Please try again after ${windowSeconds} seconds.`
                });
            }

            // They are within the limit, let them proceed to the login controller!
            next();
        } catch (error) {
            console.error("Rate limiter error:", error);
            // If Redis crashes, we fail open (let them login) so the system doesn't break
            next(); 
        }
    };
};
