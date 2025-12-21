import IORedis from "ioredis";
import 'dotenv/config';

export const redis = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null, // REQUIRED for BullMQ
  tls: {}, // required for rediss://
});