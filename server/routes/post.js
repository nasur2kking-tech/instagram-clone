// server/routes/post.js
const express = require("express");
const router = express.Router();

const Post = require("../models/Post");
const Notification = require("../models/Notification");
const User = require("../models/User");

const verifyToken = require("../middleware/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// Multer + Cloudinary setup
const upload = require("../middleware/multer");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// =======================
// CREATE POST
// =======================
router.post(
  "/",
  verifyToken,
  upload.single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new AppError("Image is required", 400);
    }

    // Upload image to Cloudinary
    let result;
    try {
      result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "posts" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    } catch (err) {
      console.error("Cloudinary Upload Error:", err);
      throw new AppError("Failed to upload image", 500);
    }

    // Save post to MongoDB
    const newPost = new Post({
      userId: req.user.id,
      caption: req.body.caption,
      image: result.secure_url,
    });

    const savedPost = await newPost.save();

    // Return post
    res.status(201).json({
      success: true,
      data: savedPost,
    });
  })
);

// =======================
// GET POSTS (HOME FEED)
// =======================
router.get(
  "/",
  verifyToken,
  asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const currentUser = await User.findById(req.user.id);
    if (!currentUser) throw new AppError("User not found", 404);

    // Include current user + following users
    const ids = [req.user.id, ...(currentUser.following || [])];

    const [posts, total] = await Promise.all([
      Post.find({ userId: { $in: ids } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments({ userId: { $in: ids } }),
    ]);

    res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
      data: posts,
    });
  })
);

// =======================
// GET POSTS BY USER (PROFILE)
// =======================
router.get(
  "/user/:userId",
  asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find({ userId: req.params.userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments({ userId: req.params.userId }),
    ]);

    res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
      data: posts,
    });
  })
);

// =======================
// LIKE / UNLIKE POST
// =======================
router.put(
  "/:id/like",
  verifyToken,
  asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) throw new AppError("Post not found", 404);

    const userId = req.user.id;
    const isLiked = post.likes.some((id) => id.toString() === userId);

    if (isLiked) {
      await post.updateOne({ $pull: { likes: userId } });
    } else {
      await post.updateOne({ $push: { likes: userId } });

      // Create notification if post is liked by someone else
      if (post.userId.toString() !== userId) {
        await Notification.create({
          userId: post.userId,
          senderId: userId,
          type: "like",
          postId: post._id,
        });
      }
    }

    const updatedPost = await Post.findById(req.params.id);

    res.status(200).json({
      success: true,
      data: updatedPost,
    });
  })
);

// =======================
// ADD COMMENT
// =======================
router.post(
  "/:id/comment",
  verifyToken,
  asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) throw new AppError("Post not found", 404);

    if (!req.body.text) {
      throw new AppError("Comment text is required", 400);
    }

    const newComment = {
      userId: req.user.id,
      text: req.body.text,
    };

    post.comments.push(newComment);
    await post.save();

    res.status(200).json({
      success: true,
      data: post.comments,
    });
  })
);

module.exports = router;