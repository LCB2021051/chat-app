const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messagesRoutes");
const { Server } = require("socket.io");

const app = express();
require("dotenv").config();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:3000"],
    methods: ["POST", "GET", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);
app.get("/", (req, res) => {
  res.send("hello world");
});

// app.options("*", cors()); // Handle preflight requests for all routes
app.options("*", (req, res) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    req.headers.origin || process.env.FRONTEND_URL
  );
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200); // Always return 200 for preflight
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB Connected Succesfully");
  })
  .catch((err) => {
    console.log(`Error : ${err.message}`);
  });

const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`Server started at Port : ${process.env.PORT}`);
});

const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL },
  credentials: true,
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });
});
