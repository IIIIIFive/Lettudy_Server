const { StatusCodes } = require("http-status-codes");
const roomService = require("../services/roomService");

const createRoom = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;

    if (!title) {
      throw new Error("방 생성 실패");
    }

    const code = await roomService.createRoom(userId, title);
    await roomService.createMember(userId, code);

    res.status(StatusCodes.CREATED).json({ code });
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: err.message,
    });
  }
};

const getRoomByCode = async (req, res) => {
  try {
    const roomCode = req.params.roomCode;

    const room = await roomService.getRoomByCode(roomCode);

    return res.status(StatusCodes.OK).json({
      title: room.title,
      code: room.code,
      notice: room.notice || "",
      ownerId: room.owner_id,
      owner: room.owner,
    });
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: err.message,
    });
  }
};

const createMember = async (req, res) => {
  try {
    const userId = req.userId;
    const roomCode = req.params.roomCode;
    await roomService.createMember(userId, roomCode);

    return res.status(StatusCodes.CREATED).json({
      message: "스터디에 가입되었습니다.",
    });
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: err.message,
    });
  }
};

const getRooms = async (req, res) => {
  try {
    const userId = req.userId;
    const rooms = await roomService.getRooms(userId);

    return res.status(StatusCodes.OK).json({
      rooms,
    });
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: err.message,
    });
  }
};

module.exports = { createRoom, getRoomByCode, createMember, getRooms };
