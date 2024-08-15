const socketIo = require("socket.io");
const chatService = require("../services/chatService");

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

  io.on("connection", (socket) => {
    console.log("New Client connected");

    socket.on("joinRoom", async (info) => {
      const { roomId, userId } = info;

      console.log(
        `joinRoom event received with roomId: ${roomId}, userId: ${userId}`
      );
      try {
        await chatService.checkMember(userId, roomId);
        socket.join(roomId);
        console.log(`Client joined room: ${roomId}`);
      } catch (err) {
        socket.emit("error", { message: err.message });
      }
    });

    socket.on("sendMessage", async (message) => {
      const { userId, roomId, content, type } = message;

      console.log(`sendMessage: ${JSON.stringify(message)}`);

      try {
        const chatData = await chatService.sendMessage(
          userId,
          roomId,
          content,
          type
        );
        io.to(roomId).emit("receiveMessage", chatData);
      } catch (err) {
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
