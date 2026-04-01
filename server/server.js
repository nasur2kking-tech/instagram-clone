const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// 🔐 ENV VALIDATION
dotenv.config();
const env = require("./config/env");

// 🔐 SECURITY
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

// 📄 LOGGER
const morgan = require("morgan");

// ✅ INIT APP
const app = express();

// 🔒 BASIC SECURITY
app.disable("x-powered-by");

// ✅ MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(mongoSanitize());
app.use(xss());

// 🚦 RATE LIMIT
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use("/api", limiter);

// ✅ ROUTES
app.use("/api/health", require("./routes/health"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/user"));
app.use("/api/posts", require("./routes/post"));
app.use("/api/messages", require("./routes/message"));

// ✅ ERROR HANDLER
const errorHandler = require("./middleware/error.middleware");

// ✅ DB CONNECT
mongoose
  .connect(env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ DB Error:", err.message);
    process.exit(1);
  });

// ✅ SERVER
const server = http.createServer(app);

// ✅ SOCKET.IO
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173",
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

// SOCKET
io.on("connection", (socket) => {
  console.log("🔌 Connected:", socket.id);

  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
  });

  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    if (user) {
      io.to(user.socketId).emit("getMessage", { senderId, text });
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

// ERROR HANDLER LAST
app.use(errorHandler);

// ✅ START SERVER
const PORT = env.PORT;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});