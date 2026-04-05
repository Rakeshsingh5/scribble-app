const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("startDrawing", (data) => {
  socket.broadcast.emit("startDrawing", data);
  });

  socket.on("draw", (data) => {
    // console.log("received draw", data);
    socket.broadcast.emit("draw", data);
  });

  socket.on("stopDrawing", () => {
    socket.broadcast.emit("stopDrawing");
  });
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

  socket.on("clearCanvas", () => {
  io.emit("clearCanvas");
  });
});


server.listen(5000, () => {
  console.log("Server running on port 5000");
});