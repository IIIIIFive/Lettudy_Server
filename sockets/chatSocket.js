const socketIo = require("socket.io");
const chatService = require("../services/chatService");
const chatsController = require("../controllers/chatsController");
const CustomError = require("../utils/CustomError");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../settings");
const conn = require("../utils/db");

const initSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "*",
      methdos: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const roomId = socket.handshake.query.roomId;

    if (!roomId) {
      socket.disconnect();
      return;
    }

    console.log(`New Client connected to ${roomId}`);

    socket.join(roomId);

    socket.on("chat", async (data) => {
      const { userId, content } = data;

      try {
        await chatService.sendMessage(userId, roomId, content);
        io.to(roomId).emit("chat", content);
      } catch (err) {
        console.log("Error saving message: ", err);
        socket.emit("error", { message: err.message });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
      socket.disconnect();
    });

    // 클라이언트 연결 종료 시
    // socket.on("disconnect", (reason) => {
    //   console.log(`User disconnected: ${socket.id}. Reason: ${reason}`);
    //   const roomId = socket.handshake.query.roomId;
    //   const userId = socket.userId;

    //   if (roomId) {
    //     socket.leave(roomId);
    //     console.log(`User ${userId} left room ${roomId}`);
    //   }
    // });
  });

  // io.on("connection", (socket) => {
  //   socket.on("chat message", (msg) => {
  //     io.emit("chat message", msg);
  //   });
  // });

  // io.use((socket, next) => {
  //   const token =
  //     socket.handshake.auth.token || socket.handshake.headers["authorization"];
  //   if (!token) {
  //     return next(new Error("Authentication error"));
  //   }

  //   jwt.verify(token, JWT_SECRET, (err, decoded) => {
  //     if (err) {
  //       return next(new Error("Authentication error"));
  //     }
  //     socket.userId = decoded.id;
  //     next();
  //   });
  // });

  // io.on("connection", (socket) => {
  //   const roomId = socket.handshake.query.roomId;
  //   const userId = socket.userId;

  //   if (!roomId) {
  //     socket.disconnect();
  //     return;
  //   }

  //   console.log(`New client connected to room: ${roomId}`);

  //   socket.join(roomId);

  //   socket.on("chat message", async (message) => {
  //     const { content } = message;

  //     try {
  //       await chatService.sendMessage(userId, roomId, content);

  //       io.to(roomId).emit("chat message", content);
  //     } catch (err) {
  //       console.log("Error saving message: ", err);
  //       socket.emit("error", { message: err.message });
  //     }
  //   });

  //   socket.on("disconnect", () => {
  //     console.log(`Client disconnected from room: ${roomId}`);
  //   });
  // });
};

module.exports = initSocket;
