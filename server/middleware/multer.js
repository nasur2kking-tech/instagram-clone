// server/middleware/multer.js
const multer = require("multer");

// Store files in memory first
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 5MB max
});

module.exports = upload;