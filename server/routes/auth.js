// server/routes/auth.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// UTILS
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// VALIDATION
const { registerSchema, loginSchema } = require("../validation/auth.validation");

// =======================
// REGISTER
// =======================
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const parsed = registerSchema.safeParse(req.body);

    // ✅ Safe error handling for validation
    if (!parsed.success) {
      const messages = Array.isArray(parsed.error?.errors)
        ? parsed.error.errors.map((e) => e.message).join(", ")
        : "Invalid input";
      throw new AppError(messages, 400);
    }

    const { username, email, password } = parsed.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError("User already exists", 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    const { password: pwd, ...others } = savedUser._doc;

    const token = jwt.sign(
      { id: savedUser._id },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    // ✅ Fixed response (send user data directly, no nested "data")
    res.status(201).json({
      ...others,
      token,
    });
  })
);

// =======================
// LOGIN
// =======================
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      const messages = Array.isArray(parsed.error?.errors)
        ? parsed.error.errors.map((e) => e.message).join(", ")
        : "Invalid input";
      throw new AppError(messages, 400);
    }

    const { email, password } = parsed.data;

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid credentials", 400);
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    const { password: pwd, ...others } = user._doc;

    res.status(200).json({
      ...others,
      token,
    });
  })
);

module.exports = router;