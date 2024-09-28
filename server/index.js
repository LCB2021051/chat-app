const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messagesRoutes");
const { Server } = require("socket.io");

const app = express();
require("dotenv").config();

/* CORS configuration */

// app.use(
//   cors({
//     origin: [
//       "https://chat-app-client-snowy.vercel.app/",
//       "http://localhost:3000",
//     ],
//     methods: ["POST", "GET", "OPTIONS"],
//     credentials: true,
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

app.use(cors());

app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);
app.get("/", (req, res) => {
  res.send("Backend is here");
});

// Handle preflight requests
app.options("*", cors()); // Let CORS middleware handle OPTIONS requests

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB Connected Successfully");
  })
  .catch((err) => {
    console.log(`Error : ${err.message}`);
  });

const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`Server started at Port : ${process.env.PORT}`);
});

/* Socket.io configuration */

const io = new Server(server, {
  cors: {
    origin: [
      "https://chat-app-server-weld.vercel.app/",
      // "https://chat-app-client-snowy.vercel.app/",
      // "http://localhost:3000",
    ],
    credentials: true,
  },
});

// const io = new Server(server, cors());

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", data.message);
    }
  });
});
