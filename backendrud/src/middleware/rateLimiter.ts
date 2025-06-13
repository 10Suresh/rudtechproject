
import { RateLimiterRedis } from "rate-limiter-flexible";
import { client } from "../utils/redisClient";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
const rateLimiter = new RateLimiterRedis({
  storeClient: client,
  keyPrefix: "middleware",
  points: 10,
  duration: 60,
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
      res.set("Retry-After", String(Math.ceil(rejRes.msBeforeNext / 1000)));
      res.status(429).json({
        status: "error",
        message: `Too many requests. Try again in ${Math.ceil(
          rejRes.msBeforeNext / 1000
        )} seconds.`,
      });
    });
};

export default rateLimiterMiddleware;
