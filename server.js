const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

require("dotenv").config();
const port = process.env.PORT || 5000;
console.log(process.env.FE);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FE,
  },
});

io.on("connection", (socket) => {
  // console.log(socket.conn);

  socket.on("click", (msg) => {
    console.log(msg);
  });
  socket.on("new_user", (user) => {
    io.emit("system_message", {
      user: "system",
      message: `User ${user.name} joined the room`,
    });
  });

  socket.on("send_message", (msg) => {
    socket.broadcast.emit("receive_message", msg);
  });
});

httpServer.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
