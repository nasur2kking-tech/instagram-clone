// =======================
// IMPORTS
// =======================
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// ENV
dotenv.config();
const env = require("./config/env");

// SECURITY
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

// LOGGER
const morgan = require("morgan");

// =======================
// INIT APP
// =======================
const app = express();
const server = http.createServer(app);

// =======================
// MIDDLEWARES
// =======================
app.disable("x-powered-by");

app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true,
}));

app.use(express.json({ limit: "10kb" }));
app.use(morgan("dev"));

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

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

// =======================
// ERROR HANDLER
// =======================
const errorHandler = require("./middleware/error.middleware");
app.use(errorHandler);

// =======================
// SOCKET.IO
// =======================
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"],
  },
});

// USERS MEMORY
let users = [];

const addUser = (userId, socketId) => {
  if (!users.some((u) => u.userId === userId)) {
    users.push({ userId, socketId });
  }
};

const getUser = (userId) => users.find((u) => u.userId === userId);

const removeUser = (socketId) => {
  users = users.filter((u) => u.socketId !== socketId);
};

// SOCKET EVENTS
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
const PORT = env.PORT || 5000;

mongoose
  .connect(env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB Error:", err.message);
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