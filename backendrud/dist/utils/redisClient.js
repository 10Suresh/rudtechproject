"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
// utils/redisClient.ts
const redis_1 = require("redis");
exports.redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});
exports.redisClient.on('error', (err) => {
    console.error('❌ Redis Error:', err);
});
exports.redisClient.connect()
    .then(() => console.log('✅ Redis connected'))
    .catch((err) => console.error('❌ Redis connection failed:', err));
