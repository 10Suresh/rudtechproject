"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
const redisClient_1 = require("../utils/redisClient");
const router = express_1.default.Router();
const rateLimiter = new rate_limiter_flexible_1.RateLimiterRedis({
    storeClient: redisClient_1.redisClient,
    keyPrefix: 'http-test-limit',
    points: 5,
    duration: 60
});
router.get('/redis-test', async (req, res) => {
    const ip = req.ip || 'anonymous';
    try {
        await rateLimiter.consume(ip);
        res.json({ message: ' Request successful' });
    }
    catch (err) {
        res.status(429).json({
            message: ` Too many requests. Try again in ${Math.ceil(err.msBeforeNext / 1000)} seconds`
        });
    }
});
exports.default = router;
