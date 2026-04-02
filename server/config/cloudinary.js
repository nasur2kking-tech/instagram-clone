// server/cloudinary.js
const cloudinary = require("cloudinary").v2;
const env = require("./env"); // use validated env

// Optional debug log to confirm keys are loaded on Render
console.log("Cloudinary Cloud Name:", env.CLOUDINARY_CLOUD_NAME);
console.log("Cloudinary API Key:", env.CLOUDINARY_API_KEY ? "Loaded ✅" : "Missing ❌");
console.log("Cloudinary API Secret:", env.CLOUDINARY_API_SECRET ? "Loaded ✅" : "Missing ❌");

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;