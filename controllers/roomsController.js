const { StatusCodes } = require("http-status-codes");
const roomService = require("../services/roomService");

const createRoom = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;

    const result = await roomService.createRoom(userId, title);

    res.status(StatusCodes.CREATED).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

const getRooms = async (req, res) => {
  try {
    const userId = req.userId;
    const result = await roomService.getRooms(userId);

    return res.status(StatusCodes.OK).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

const updateNotice = async (req, res) => {
  try {
    const roomId = req.roomId;
    const { notice } = req.body;

    const result = await roomService.updateNotice(roomId, notice);

    return res.status(StatusCodes.OK).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

const getRoom = async (req, res) => {
  try {
    const userId = req.userId;
    const roomId = req.roomId;
    const result = await roomService.getRoom(roomId, userId);

    return res.status(StatusCodes.OK).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

module.exports = {
  createRoom,
  getRooms,
  updateNotice,
  getRoom,
};
