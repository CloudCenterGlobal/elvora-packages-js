import { createClient } from "redis";

let redisClient = createClient({
  url: process.env.REDIS_URL,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
});

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REDIS_URL: string;
      REDIS_USERNAME: string;
      REDIS_PASSWORD: string;
    }
  }
}

const initRedisClient = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  redisClient.on("error", (err) => console.log("Redis Client Error", err));

  redisClient.on("ready", () => {
    console.log("Redis Client Connected");
  });

  return redisClient;
};

export { initRedisClient, redisClient };
