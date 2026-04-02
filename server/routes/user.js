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
    user: req.user,
  });
});

// =======================
// FOLLOW / UNFOLLOW USER
// =======================
router.put("/:id/follow", verifyToken, async (req, res) => {
  try {
    // ❌ Prevent self-follow
    if (req.user.id === req.params.id) {
      return res.status(400).json("You can't follow yourself");
    }

    const targetUser = await User.findById(req.params.id); // user to follow/unfollow
    const currentUser = await User.findById(req.user.id); // logged-in user

    if (!targetUser || !currentUser) {
      return res.status(404).json("User not found");
    }

    const isFollowing = targetUser.followers
      .map(id => id.toString())
      .includes(req.user.id);

    if (!isFollowing) {
      // ✅ FOLLOW
      await targetUser.updateOne({ $push: { followers: req.user.id } });
      await currentUser.updateOne({ $push: { following: req.params.id } });

      // 🔔 CREATE NOTIFICATION
      await Notification.create({
        userId: req.params.id,   // receiver
        senderId: req.user.id,   // who followed
        type: "follow",
      });

      res.status(200).json("User followed");
    } else {
      // ✅ UNFOLLOW
      await targetUser.updateOne({ $pull: { followers: req.user.id } });
      await currentUser.updateOne({ $pull: { following: req.params.id } });

      res.status(200).json("User unfollowed");
    }
  } catch (err) {
    console.error("FOLLOW ERROR:", err);
    res.status(500).json(err.message);
  }
});

module.exports = router;