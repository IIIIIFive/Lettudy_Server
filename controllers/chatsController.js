const { StatusCodes } = require("http-status-codes");
const chatService = require("../services/chatService");

const getChats = async (req, res) => {
  try {
    const roomId = req.roomId;
    const result = await chatService.getChats(roomId);

    res.status(StatusCodes.OK).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

const sendMessage = async (req, res) => {
  try {
    const userId = req.userId;
    const roomId = req.roomId;
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
