// server/routes/message.js
const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const verifyToken = require("../middleware/authMiddleware");

// =======================
// SEND MESSAGE
// =======================
router.post("/", verifyToken, async (req, res) => {
  try {
    const { receiverId, text } = req.body;

    if (!receiverId || !text) {
      return res.status(400).json({ message: "Receiver and text are required" });
    }

    const newMessage = new Message({
      senderId: req.user.id,
      receiverId,
      text,
    });

    const saved = await newMessage.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    console.error("SEND MSG ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// =======================
// GET CHAT BETWEEN 2 USERS
// =======================
router.get("/:userId", verifyToken, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.user.id, receiverId: req.params.userId },
        { senderId: req.params.userId, receiverId: req.user.id },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    console.error("GET MSG ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;