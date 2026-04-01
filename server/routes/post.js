const express = require("express");
const router = express.Router();

const Post = require("../models/Post");
const Notification = require("../models/Notification");

const verifyToken = require("../middleware/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// const redisClient = require("../config/redis");
const { clearCacheByPattern } = require("../utils/cacheHelper");

// IMAGE UPLOAD
const multer = require("multer");
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");

const storage = multer.memoryStorage();
const upload = multer({ storage });


// =======================
// CREATE POST
// =======================
router.post(
  "/",
  verifyToken,
  upload.single("image"),
  asyncHandler(async (req, res) => {
    let imageUrl = "";

    if (req.file) {
      const streamUpload = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "posts" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

      const result = await streamUpload();
      imageUrl = result.secure_url;
    }

    const newPost = new Post({
      userId: req.user.id,
      caption: req.body.caption,
      image: imageUrl,
    });

    const savedPost = await newPost.save();

    // CLEAR CACHE
    await clearCacheByPattern("posts:*");

    res.status(201).json({
      success: true,
      data: savedPost,
    });
  })
);


// =======================
// GET ALL POSTS (CACHED)
// =======================
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const cacheKey = `posts:${page}:${limit}`;

    // ✅ FIX: GET CACHE
    const cached = null; // await redisClient.get(cacheKey);

    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments(),
    ]);

    const response = {
      success: true,
      page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
      data: posts,
    };

    // ✅ FIX: SET CACHE
    // await redisClient.setEx(cacheKey, 60, JSON.stringify(response));

    res.status(200).json(response);
  })
);


// =======================
// GET POSTS BY USER
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
// LIKE / UNLIKE
// =======================
router.put(
  "/:id/like",
  verifyToken,
  asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) throw new AppError("Post not found", 404);

    const userId = req.user.id;

    const isLiked = post.likes.some(
      (id) => id.toString() === userId
    );

    if (isLiked) {
      await post.updateOne({ $pull: { likes: userId } });
    } else {
      await post.updateOne({ $push: { likes: userId } });

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

    // CLEAR CACHE
    // await clearCacheByPattern("posts:*");

    res.status(200).json({
      success: true,
      data: updatedPost,
    });
  })
);


// =======================
// COMMENT
// =======================
router.post(
  "/:id/comment",
  verifyToken,
  asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) throw new AppError("Post not found", 404);

    const newComment = {
      userId: req.user.id,
      text: req.body.text,
    };

    post.comments.push(newComment);
    await post.save();

    // CLEAR CACHE
    await clearCacheByPattern("posts:*");

    res.status(200).json({
      success: true,
      data: post.comments,
    });
  })
);

module.exports = router;