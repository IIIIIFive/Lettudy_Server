const { StatusCodes } = require("http-status-codes");
const roomService = require("../services/roomService");
const memberService = require("../services/memberService");

const createRoom = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;

    if (!title) {
      throw new Error("방 생성 실패");
    }

    const { roomId, code } = await roomService.createRoom(userId, title);
    const profileNum = await memberService.createMember(userId, code);

    res.status(StatusCodes.CREATED).json({ code, roomId, profileNum });
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: err.message,
    });
  }
};

const getRoomByCode = async (req, res) => {
  try {
    const code = req.params.roomCode;

    const room = await roomService.getRoomByCode(code);

    return res.status(StatusCodes.OK).json({
      roomId: room.roomId,
      title: room.title,
      notice: room.notice || "",
      memberCount: room.member_count,
      ownerId: room.owner_id,
      owner: room.owner,
      createdAt: room.created_at,
    });
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: err.message,
    });
  }
};

const getRooms = async (req, res) => {
  try {
    const userId = req.userId;
    const rooms = await roomService.getRooms(userId);

    return res.status(StatusCodes.OK).json({
      count: rooms.length,
      rooms,
    });
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: err.message,
    });
  }
};

const updateNotice = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const userId = req.userId;
    const { count } = await memberService.checkMember(userId, roomId);

    if (count == 0) {
      res.status(StatusCodes.FORBIDDEN).json({
        message: "가입하지 않은 스터디입니다.",
      });
    }

    const { notice } = req.body;

    await roomService.updateNotice(roomId, notice);

    return res.status(StatusCodes.OK).json({
      notice,
    });
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({
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
