const { createClient } = require("redis");

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

redisClient.on("error", (err) => console.log("💀 Redis Client Error 💀", err));

(async () => {
  await redisClient.connect();
  console.log("✅ Redis connected successfully");
})();

module.exports = redisClient;
