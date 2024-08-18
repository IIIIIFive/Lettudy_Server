const { StatusCodes } = require("http-status-codes");
const chatService = require("../services/chatService");

// 채팅 내역 조회
const getChats = async (req, res) => {
  try {
    const userId = req.userId;
    const { roomId } = req.params;
    const result = await chatService.getChats(userId, roomId);

    res.status(StatusCodes.OK).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

// 채팅 메시지 보내기
const sendMessage = async (req, res) => {
  try {
    const userId = req.userId;
    const { roomId } = req.params;
    const { content, type } = req.body;

    const result = await chatService.sendMessage(userId, roomId, content, type);
    res.status(StatusCodes.CREATED).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

// 이미지 업로드
const sendImage = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.userId;
    const { roomId } = req.params;

    const result = await chatService.sendImage(file, userId, roomId);
    res.status(StatusCodes.CREATED).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

// 채팅 메시지 삭제
const deleteMessage = async (req, res) => {
  try {
    const userId = req.userId;
    const { roomId, chatItemId } = req.params;

    const result = await chatService.deleteMessage(userId, roomId, chatItemId);

    res.status(StatusCodes.OK).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

module.exports = {
  getChats,
  sendMessage,
  sendImage,
  deleteMessage,
};
