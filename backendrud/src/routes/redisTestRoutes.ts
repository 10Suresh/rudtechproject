// routes/redisTestRoutes.ts
import express from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { redisClient } from '../utils/redisClient';

const router = express.Router();

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'http-test-limit',
  points: 5,       // 5 requests
  duration: 60     // per 60 seconds
});

router.get('/redis-test', async (req, res) => {
  const ip = req.ip || 'anonymous';

  try {
    await rateLimiter.consume(ip);
    res.json({ message: '✅ Request successful' });
  } catch (err: any) {
    res.status(429).json({
      message: `❌ Too many requests. Try again in ${Math.ceil(err.msBeforeNext / 1000)} seconds`
    });
  }
});

export default router;
