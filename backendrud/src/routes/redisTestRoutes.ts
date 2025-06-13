
import express from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { client } from '../utils/redisClient';

const router = express.Router();

const rateLimiter = new RateLimiterRedis({
  storeClient: client,
  keyPrefix: 'http-test-limit',
  points: 5,      
  duration: 60     
});

router.get('/redis-test', async (req, res) => {
  const ip = req.ip || 'anonymous';

  try {
    await rateLimiter.consume(ip);
    res.json({ message: ' Request successful' });
  } catch (err: any) {
    res.status(429).json({
      message: ` Too many requests. Try again in ${Math.ceil(err.msBeforeNext / 1000)} seconds`
    });
  }
});

export default router;
