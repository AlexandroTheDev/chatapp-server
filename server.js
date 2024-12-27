const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

require("dotenv").config();
const port = 3001 || process.env.PORT;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("new_user", (room, user) => {
    socket.join(room);
    socket.data.userId = socket.id;
    socket.data.name = user.name;
    io.to(room).emit("system_message", {
      user: { name: "system" },
      message: `User ${user.name} joined the room`,
    });
  });

  socket.on("send_message", (room, msg) => {
    socket.to(room).emit("receive_message", room, msg);
  });

  socket.on("typing", (room, user) => {
    socket.broadcast.to(room).emit("typing", room, user);
  });

  socket.on("disconnect", () => {
    if (socket.data.name) {
      io.emit("system_message", {
        user: { name: "system" },
        message: `${socket.data.name} left the room`,
      });
    }
  });
});

httpServer.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
