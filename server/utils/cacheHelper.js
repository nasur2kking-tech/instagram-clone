const redisClient = require("../config/redis");

// 🔥 SAFE DELETE USING SCAN (PRODUCTION SAFE)
const clearCacheByPattern = async (pattern) => {
  let cursor = "0";

  do {
    const reply = await redisClient.scan(cursor, {
      MATCH: pattern,
      COUNT: 100,
    });

    cursor = reply.cursor;

    if (reply.keys.length > 0) {
      await redisClient.del(reply.keys);
    }

  } while (cursor !== "0");
};

module.exports = { clearCacheByPattern };