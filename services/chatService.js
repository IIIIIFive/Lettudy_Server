const conn = require("../utils/db");
const chatQueries = require("../queries/chatQueries");
const { v4: uuidv4 } = require("uuid");
const CustomError = require("../utils/CustomError");
const { StatusCodes } = require("http-status-codes");
const memberQueries = require("../queries/memberQueries");
const userQueries = require("../queries/userQueries");

const getChats = async (roomId) => {
  try {
    const chatsResult = await conn.query(chatQueries.getChatIdByRoomId, [
      roomId,
    ]);

    if (chatsResult[0].length === 0) {
      throw new CustomError(
        "채팅방이 존재하지 않습니다.",
        StatusCodes.NOT_FOUND
      );
    }

    const chatId = chatsResult[0][0].id;
    const chatItemsResult = await conn.query(chatQueries.getChatItemsByChatId, [
      chatId,
    ]);

    for (let chatItem of chatItemsResult[0]) {
      const userId = chatItem.sender;
      const userResult = await conn.query(userQueries.getNameById, userId);
      chatItem.sender = userResult[0][0].name;
      const profileNum = await conn.query(memberQueries.getProfileNumByUserId, [
        userId,
        roomId,
      ]);
      chatItem.profileNum = profileNum[0][0].profile_num;
    }

    return {
      message: "채팅내역 조회 성공",
      chatId,
      chats: chatItemsResult[0],
    };
  } catch (err) {
    throw err;
  }
};

const sendMessage = async (userId, roomId, content) => {
  try {
    const chatIdResult = await conn.query(chatQueries.getChatIdByRoomId, [
      roomId,
    ]);

    if (chatIdResult[0].length === 0) {
      throw new CustomError(
        "채팅방을 찾을 수 없습니다.",
        StatusCodes.NOT_FOUND
      );
    }

    const chatId = chatIdResult[0][0].id;
    const chatItemId = uuidv4();
    const values = [chatItemId, chatId, userId, content];

    await conn.query(chatQueries.sendMessage, values);

    return {
      message: "채팅 메시지 전송 성공",
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getChats,
  sendMessage,
};
