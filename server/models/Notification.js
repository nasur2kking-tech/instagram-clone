const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // receiver
    senderId: { type: String, required: true }, // who did action
    type: { type: String, required: true }, // "like" | "follow"
    postId: { type: String }, // optional (for likes)
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);