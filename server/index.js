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
  socket.to(socket.roomId).emit("startDrawing", data);
  });

  socket.on("draw", (data) => {
    // console.log("received draw", data);
    socket.to(socket.roomId).emit("draw", data);
  });

  socket.on("stopDrawing", () => {
    socket.to(socket.roomId).emit("stopDrawing");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

  socket.on("clearCanvas", () => {
  socket.to(socket.roomId).emit("clearCanvas");
  });

  socket.on("joinRoom", (roomId) => {
  socket.join(roomId);
  console.log(`User ${socket.id} joined room ${roomId}`);
  socket.roomId = roomId;
});

});


server.listen(5000, () => {
  console.log("Server running on port 5000");
});