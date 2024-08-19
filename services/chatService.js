const conn = require("../utils/db");
const chatQueries = require("../queries/chatQueries");
const { v4: uuidv4 } = require("uuid");
const CustomError = require("../utils/CustomError");
const { StatusCodes } = require("http-status-codes");
const memberQueries = require("../queries/memberQueries");
const userQueries = require("../queries/userQueries");

const checkMember = async (userId, roomId) => {
  const memberResult = await conn.query(memberQueries.checkMember, [
    roomId,
    userId,
  ]);

  console.log("checkMember Query Result: ", memberResult[0][0]);

  if (memberResult[0][0].count === 0) {
    throw new CustomError(
      "해당 스터디에 가입되어 있지 않은 회원입니다.",
      StatusCodes.FORBIDDEN
    );
  }
};

const getChats = async (userId, roomId) => {
  try {
    // 해당 스터디방에 가입된 회원인지 확인
    await checkMember(userId, roomId);

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

const sendMessage = async (userId, roomId, content, type) => {
  try {
    // 해당 스터디방에 가입된 회원인지 확인
    await checkMember(userId, roomId);

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
    const values = [
      chatItemId,
      chatId,
      userId,
      content,
      type === "image" ? content : null,
    ];

    await conn.query(chatQueries.sendMessage, values);

    return {
      message: "채팅 메시지 전송 성공",
    };
  } catch (err) {
    throw err;
  }
};

const sendImage = async (file, userId, roomId) => {
  try {
    if (!file) {
      throw new CustomError(
        "파일이 존재하지 않습니다.",
        StatusCodes.BAD_REQUEST
      );
    }

    // 일단 파일로 대체
    const imageUrl = file;
    return sendMessage(userId, roomId, imageUrl, "image");
  } catch (err) {
    throw err;
  }
};

const deleteMessage = async (userId, roomId, chatItemId) => {
  try {
    // 해당 스터디방에 가입된 회원인지 확인
    await checkMember(userId, roomId);

    // 채팅방 찾기
    const chatRoomResult = await conn.query(chatQueries.getChatIdByRoomId, [
      roomId,
    ]);

    if (chatRoomResult[0].length === 0) {
      throw new CustomError(
        "채팅방을 찾을 수 없습니다.",
        StatusCodes.NOT_FOUND
      );
    }

    const chatId = chatRoomResult[0][0].id;
    const deleteResult = await conn.query(chatQueries.deleteMessage, [
      chatItemId,
      chatId,
      userId,
    ]);

    if (deleteResult[0].affectedRows === 0) {
      throw new CustomError(
        "메시지를 삭제할 수 없습니다.",
        StatusCodes.NOT_FOUND
      );
    }

    return {
      message: "채팅 메시지 삭제 성공",
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  checkMember,
  getChats,
  sendMessage,
  sendImage,
  deleteMessage,
};
