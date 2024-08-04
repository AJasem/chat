const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("join", ({ room, user }) => {
    socket.join(room);
    console.log(`${user} joined room ${room}`);
  });

  socket.on("message", (data) => {
    const messageData = {
      message: data.message,
      user: data.user,
      date: new Date().toLocaleString(),
    };

    axios
      .post("https://chatapi.ahmads.dev/api/send", {
        roomName: data.room,
        value: data.message,
        user: data.user,
      })
      .then((response) => {
        console.log("message saved", response.data);
      })
      .catch((error) => {
        console.error("Error saving message:", error);
      });

    io.to(data.room).emit("message", messageData);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(3001, () => {
  console.log("Socket.IO server running on http://localhost:3001");
});
