const redis = require("redis");
import dotenv from "dotenv";

dotenv.config();

// const client = redis.createClient({
//   socket: {
//     host: process.env.REDIS_HOST || "localhost",
//     port: Number(process.env.REDIS_PORT) || 6379,
//     connectTimeout: 10000,
//   },
// });
const client = redis.createClient({
  url: process.env.REDIS_URL
});
let isConnected = false;

async function connectRedis() {
  if (!isConnected && !client.isOpen) {
    try {
      await client.connect();
      isConnected = true;
      console.log("✅ Connected to Redis");
    } catch (error) {
      console.error(" Error connecting to Redis:", error);
      process.exit(1);
    }
  }
}

// Immediately call the function
connectRedis();

export { client };
