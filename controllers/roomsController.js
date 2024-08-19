const { StatusCodes } = require("http-status-codes");
const roomService = require("../services/roomService");
const CustomError = require("../utils/CustomError");

const createRoom = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;

    if (title === undefined || title.length > 10) {
      throw new CustomError(
        "스터디 이름이 없거나 10자보다 깁니다",
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

    if (!Array.isArray(notice)) {
      throw new CustomError(
        "요청 형식을 확인해주세요",
        StatusCodes.BAD_REQUEST
      );
    }

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
