// =======================
// DNS FIX (VERY IMPORTANT)
// =======================
require("dns").setDefaultResultOrder("ipv4first");

// =======================
// IMPORTS
// =======================
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const morgan = require("morgan");

// =======================
// ENV
// =======================
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// =======================
// INIT APP
// =======================
const app = express();
app.set("trust proxy", 1); // ✅ IMPORTANT (for Render / proxies)
const server = http.createServer(app);

// =======================
// MIDDLEWARES
// =======================
app.disable("x-powered-by");

// ✅ CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://instagram-clone-chi-five.vercel.app",
    ],
    credentials: true,
  })
);

// BODY PARSER
app.use(express.json({ limit: "10kb" }));

// LOGGER
app.use(morgan("dev"));

// SECURITY HEADERS
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// SANITIZATION
app.use(mongoSanitize());
app.use(xss());

// RATE LIMIT
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use("/api", limiter);

// =======================
// HEALTH CHECK
// =======================
app.get("/", (req, res) => {
  res.status(200).send("API is running 🚀");
});

// =======================
// ROUTES
// =======================
app.use("/api/health", require("./routes/health"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/user"));
app.use("/api/posts", require("./routes/post"));
app.use("/api/messages", require("./routes/message"));

console.log("✅ ROUTES LOADED");

// =======================
// ERROR HANDLER
// =======================
const errorHandler = require("./middleware/error.middleware");
app.use(errorHandler);

// =======================
// SOCKET.IO (FIXED CORS)
// =======================
const io = require("socket.io")(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://instagram-clone-chi-five.vercel.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let users = [];

// ADD USER
const addUser = (userId, socketId) => {
  if (!users.some((u) => u.userId === userId)) {
    users.push({ userId, socketId });
  }
};

// GET USER
const getUser = (userId) => users.find((u) => u.userId === userId);

// REMOVE USER
const removeUser = (socketId) => {
  users = users.filter((u) => u.socketId !== socketId);
};

io.on("connection", (socket) => {
  console.log("🔌 Connected:", socket.id);

  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
  });

  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);

    if (user) {
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", socket.id);
    removeUser(socket.id);
  });
});

// =======================
// DATABASE + SERVER START
// =======================
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing! Set it in Render dashboard.");
  process.exit(1);
}

console.log("Using MONGO_URI:", MONGO_URI);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err.message);
    process.exit(1);
  });

// =======================
// GLOBAL ERRORS
// =======================
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});