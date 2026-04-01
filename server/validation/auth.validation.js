const { z } = require("zod");

// REGISTER VALIDATION
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// LOGIN VALIDATION
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password required"),
});

module.exports = {
  registerSchema,
  loginSchema,
};