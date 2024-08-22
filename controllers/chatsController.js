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
    const { content } = req.body;

    const result = await chatService.sendMessage(userId, roomId, content);
    res.status(StatusCodes.CREATED).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

module.exports = {
  getChats,
  sendMessage,
};
