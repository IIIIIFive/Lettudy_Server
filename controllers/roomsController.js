const { StatusCodes } = require("http-status-codes");
const roomService = require("../services/roomService");
const CustomError = require("../utils/CustomError");

const createRoom = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;

    if (!title) {
      throw new CustomError(
        "스터디 이름이 필요합니다",
        StatusCodes.BAD_REQUEST
      );
    }

    const result = await roomService.createRoom(userId, title);

    res.status(StatusCodes.CREATED).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

const getRoomByCode = async (req, res) => {
  try {
    const code = req.params.roomCode;

    const result = await roomService.getRoomByCode(code);

    return res.status(StatusCodes.OK).json(result);
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

module.exports = {
  createRoom,
  getRoomByCode,
  getRooms,
  updateNotice,
};
