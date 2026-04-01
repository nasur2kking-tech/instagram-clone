// const { createClient } = require("redis");

// const redisClient = createClient({
//   url: "redis://redis:6379" // ✅ NOT localhost
// });

// redisClient.on("error", (err) => {
//   console.error("❌ Redis Error:", err);
// });

// (async () => {
//   await redisClient.connect();
//   console.log("✅ Redis Connected");
// })();

// module.exports = redisClient;