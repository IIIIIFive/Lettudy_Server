const socketIo = require("socket.io");
const chatService = require("../services/chatService");
const chatsController = require("../controllers/chatsController");
const CustomError = require("../utils/CustomError");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../settings");
const conn = require("../utils/db");
const memberQueries = require("../queries/memberQueries");
const chatQueries = require("../queries/chatQueries");
const userQueries = require("../queries/userQueries");

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

        const usernameResult = await conn.query(
          userQueries.getNameById,
          userId
        );
        const username = usernameResult[0][0].name;

        const chatIdResult = await conn.query(
          chatQueries.getChatIdByRoomId,
          roomId
        );
        const chatId = chatIdResult[0][0]?.id;

        const chatResult = await conn.query(chatQueries.getCreatedAt, [
          chatId,
          userId,
        ]);
        const createdAt = chatResult[0][0]?.created_at;

        const profileNumResult = await conn.query(
          memberQueries.getProfileNumByUserId,
          [userId, roomId]
        );
        const profileNum = profileNumResult[0][0].profile_num;

        const chatData = {
          senderId: userId,
          senderName: username,
          content,
          createdAt,
          profileNum,
        };

        io.to(roomId).emit("chat", chatData);
      } catch (err) {
        console.log("Error saving message: ", err);
        socket.emit("error", { message: err.message });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
      socket.disconnect();
    });
  });
};

module.exports = initSocket;
