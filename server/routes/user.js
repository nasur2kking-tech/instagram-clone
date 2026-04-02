// server/routes/user.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const User = require("../models/User");
const Notification = require("../models/Notification");

// =======================
// PROTECTED PROFILE ROUTE
// =======================
router.get("/profile", verifyToken, (req, res) => {
  res.status(200).json({
    message: "You are authenticated 🔐",
    user: req.user || null,
  });
});

// =======================
// FOLLOW / UNFOLLOW USER
// =======================
router.put("/:id/follow", verifyToken, async (req, res) => {
  try {
    const targetId = req.params.id;
    const currentUserId = req.user.id;

    // ❌ Prevent self-follow
    if (currentUserId === targetId) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }

    const targetUser = await User.findById(targetId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Safe followers check
    const followersArray = Array.isArray(targetUser.followers)
      ? targetUser.followers.map((id) => id.toString())
      : [];

    const isFollowing = followersArray.includes(currentUserId);

    if (!isFollowing) {
      // ✅ FOLLOW
      await targetUser.updateOne({ $push: { followers: currentUserId } });
      await currentUser.updateOne({ $push: { following: targetId } });

      // 🔔 CREATE NOTIFICATION
      await Notification.create({
        userId: targetId,    // receiver
        senderId: currentUserId, // who followed
        type: "follow",
      });

      res.status(200).json({ message: "User followed" });
    } else {
      // ✅ UNFOLLOW
      await targetUser.updateOne({ $pull: { followers: currentUserId } });
      await currentUser.updateOne({ $pull: { following: targetId } });

      res.status(200).json({ message: "User unfollowed" });
    }
  } catch (err) {
    console.error("FOLLOW ERROR:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

module.exports = router;