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

  global.io = io;

  io.use((socket, next) => {
    const token =
      socket.handshake.auth.token || socket.handshake.headers["authorization"];
    if (!token) {
      return next(new Error("Authentication error"));
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return next(new Error("Authentication error"));
      }
      socket.userId = decoded.id;
      next();
    });
  });

  io.on("connection", (socket) => {
    console.log("New Client connected");

    // socket.on("chat message", (message) => {
    //   console.log("message: " + message);
    //   io.emit("chat message", message);
    // });

    socket.on("joinRoom", async (info) => {
      const { roomId } = info;
      userId = socket.userId;

      console.log("roomId: ", roomId);
      console.log("userId: ", userId);

      socket.join(roomId);

      try {
        const [userResult] = await conn.query(
          `SELECT name FROM users WHERE id = ?`,
          userId
        );

        if (userResult.length > 0) {
          const userName = userResult[0].name;
          console.log(`${userName} joined room: ${roomId}`);

          io.to(roomId).emit("Join Room", { userId, userName });
          // socket.to(roomId).emit(`joined Room`, { userId, userName });

          // socket.removeAllListeners("chat message");

          // 메시지 보내기
          socket.on("chat message", async (message) => {
            const { content, type } = message;

            console.log("user id: ", userId);

            try {
              const result = await chatService.sendMessage(
                userId,
                roomId,
                content,
                type
              );

              io.to(roomId).emit("chat message", { userName, content });
            } catch (err) {
              console.log("Error saving message: ", err);
              socket.emit("error", { message: err.message });
            }
          });
        } else {
          throw new CustomError("방이나 사용자를 찾을 수 없습니다.", 404);
        }
      } catch (err) {
        console.log("Error joining room: ", err);
        socket.emit("error", { message: err.message });
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("Client disconnected:", reason);
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  });
};

module.exports = initSocket;
