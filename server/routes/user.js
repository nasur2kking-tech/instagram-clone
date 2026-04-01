const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const User = require("../models/User");
const Notification = require("../models/Notification"); // ✅ ADDED


// ✅ PROTECTED ROUTE (CHECK AUTH)
router.get("/profile", verifyToken, (req, res) => {
  res.status(200).json({
    message: "You are authenticated 🔐",
    user: req.user,
  });
});


// ✅ FOLLOW / UNFOLLOW USER (WITH TOKEN + 🔔 NOTIFICATION)
router.put("/:id/follow", verifyToken, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id); // user to follow
    const currentUser = await User.findById(req.user.id); // logged-in user

    if (!targetUser || !currentUser) {
      return res.status(404).json("User not found");
    }

    // ❌ Prevent self-follow
    if (req.params.id === req.user.id) {
      return res.status(400).json("You cannot follow yourself");
    }

    const isFollowing = targetUser.followers
      .map(id => id.toString())
      .includes(req.user.id);

    if (!isFollowing) {
      // ✅ FOLLOW
      await targetUser.updateOne({
        $push: { followers: req.user.id },
      });

      await currentUser.updateOne({
        $push: { following: req.params.id },
      });

      // 🔔 CREATE NOTIFICATION (only when following)
      await Notification.create({
        userId: req.params.id,   // receiver
        senderId: req.user.id,   // who followed
        type: "follow",
      });

      res.status(200).json("Followed");

    } else {
      // ✅ UNFOLLOW
      await targetUser.updateOne({
        $pull: { followers: req.user.id },
      });

      await currentUser.updateOne({
        $pull: { following: req.params.id },
      });

      res.status(200).json("Unfollowed");
    }

  } catch (err) {
    console.error("FOLLOW ERROR:", err);
    res.status(500).json(err.message);
  }
});

module.exports = router;