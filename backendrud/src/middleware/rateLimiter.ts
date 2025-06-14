import { RateLimiterRedis } from "rate-limiter-flexible";
import { client } from "../utils/redisClient";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
// const rateLimiter = new RateLimiterRedis({
//   storeClient: client,
//   keyPrefix: "middleware",
//   points: 20,
//   duration: 60,
// });
const rateLimiter = new RateLimiterRedis({
  storeClient: client,
  keyPrefix: "middleware",
  points: 20,
  duration: 60,
  blockDuration: 60,
});

const rateLimiterMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("rate limit is working");

  const key = req.headers.authorization
    ? (
        jwt.verify(
          req.headers.authorization.split(" ")[1],
          process.env.JWT_SECRET!
        ) as any
      ).id
    : req.ip;

  rateLimiter
    .consume(key)
    .then(() => next())
    .catch((rejRes) => {
      const retrySecs = Math.ceil(rejRes.msBeforeNext / 1000);
      res.setHeader("Retry-After", String(retrySecs));
      res.status(429).json({
        status: "error",
        message: `many requests.Suresh Retry in ${retrySecs} seconds.`,
      });
    });
};

export default rateLimiterMiddleware;
