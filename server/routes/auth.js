const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// UTILS
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

const { registerSchema, loginSchema } = require("../validation/auth.validation");

// =======================
// REGISTER
// =======================
router.post("/register", asyncHandler(async (req, res) => {

  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new AppError(
      parsed.error.errors.map(e => e.message).join(", "),
      400
    );
  }

  const { username, email, password } = parsed.data;

  // CHECK USER EXISTS
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  // HASH PASSWORD
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // CREATE USER
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  const savedUser = await newUser.save();

  // REMOVE PASSWORD
  const { password: pwd, ...others } = savedUser._doc;

  res.status(201).json({
    success: true,
    data: others,
  });
}));

// =======================
// LOGIN
// =======================
router.post("/login", asyncHandler(async (req, res) => {

  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new AppError(
      parsed.error.errors.map(e => e.message).join(", "),
      400
    );
  }

  const { email, password } = parsed.data;

  // FIND USER
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // CHECK PASSWORD
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid credentials", 400);
  }

  // CREATE TOKEN
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET || "secretkey",
    { expiresIn: "7d" }
  );

  const { password: pwd, ...others } = user._doc;

  res.status(200).json({
    success: true,
    data: { ...others, token },
  });
}));

module.exports = router;