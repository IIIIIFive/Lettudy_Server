const conn = require("../utils/db");
const roomQueries = require("../queries/roomQueries");
const chatQueries = require("../queries/chatQueries");
const { v4: uuidv4 } = require("uuid");
const { createCode } = require("../utils/hashedpw");
const CustomError = require("../utils/CustomError");
const { StatusCodes } = require("http-status-codes");
const memberQueries = require("../queries/memberQueries");

const generateUniqueCode = async () => {
  let code;
  let isUnique = false;

  while (!isUnique) {
    code = createCode();
    const [[result]] = await conn.query(roomQueries.checkCode, code);
    isUnique = result.count === 0;
  }
  return code;
};

const createRoom = async (userId, title) => {
  try {
    const roomId = uuidv4();
    const chatId = uuidv4();
    const code = await generateUniqueCode();
    const profileNum = 1;

    await conn.query(roomQueries.createRoom, [
      roomId,
      userId,
      title,
      code,
      profileNum,
    ]);
    await conn.query(chatQueries.createChat, [chatId, roomId]);
    await conn.query(memberQueries.createMember, [userId, roomId, profileNum]);

    return { message: "스터디 생성 성공", roomId, code, profileNum };
  } catch (err) {
    throw err;
  }
};

const getRoomByCode = async (code) => {
  try {
    const [[getIdResult]] = await conn.query(roomQueries.getIdByCode, code);
    if (!getIdResult) {
      throw new CustomError(
        "유효하지 않은 스터디 코드입니다.",
        StatusCodes.BAD_REQUEST
      );
    }

    const [[room]] = await conn.query(roomQueries.getRoomById, getIdResult.id);
    if (!room) {
      throw new CustomError(
        "존재하지 않는 스터디입니다.",
        StatusCodes.BAD_REQUEST
      );
    }
    return {
      message: "스터디 조회 성공",
      roomId: room.roomId,
      title: room.title,
      notice: room.notice || "",
      memberCount: room.member_count,
      ownerId: room.owner_id,
      owner: room.owner,
      createdAt: room.created_at,
    };
  } catch (err) {
    throw err;
  }
};

const getRooms = async (userId) => {
  try {
    const [roomsResult] = await conn.query(roomQueries.getRooms, userId);
    const rooms = roomsResult.map((room) => ({
      roomId: room.id,
      title: room.title,
      code: room.code,
      notice: room.notice || "",
      profileNum: room.profile_num,
      alarm: room.alarm,
      createdAt: room.created_at,
      joinedAt: room.joined_at,
    }));

    return {
      message: "스터디 목록 조회 성공",
      count: rooms.length,
      rooms,
    };
  } catch (err) {
    throw err;
  }
};

const updateNotice = async (roomId, notice) => {
  try {
    const [noticeResult] = await conn.query(roomQueries.updateNotice, [
      notice,
      roomId,
    ]);

    if (noticeResult.affectedRows === 0) {
      throw new CustomError("공지 수정 실패", StatusCodes.BAD_REQUEST);
    }

    return { message: "공지 수정 성공", notice };
  } catch (err) {
    throw err;
  }
};

const checkRoom = async (roomId) => {
  try {
    const [[{ count }]] = await conn.query(roomQueries.checkRoomId, roomId);

    return count;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createRoom,
  getRoomByCode,
  getRooms,
  updateNotice,
  checkRoom,
};
