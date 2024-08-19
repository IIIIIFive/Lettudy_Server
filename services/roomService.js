const conn = require("../utils/db");
const roomQueries = require("../queries/roomQueries");
const chatQueries = require("../queries/chatQueries");
const memberQueries = require("../queries/memberQueries");
const { v4: uuidv4 } = require("uuid");
const { createCode } = require("../utils/hashedpw");
const CustomError = require("../utils/CustomError");
const { StatusCodes } = require("http-status-codes");
const { getMembersRecord } = require("./memberService");
const { getAttendanceDate, getSchedule } = require("./scheduleService");
const { getUserAttendances } = require("./attendanceService");

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

const checkRoom = async (roomId) => {
  // auth.js에서 사용
  try {
    const [[{ count }]] = await conn.query(roomQueries.checkRoomId, roomId);

    return count;
  } catch (err) {
    throw err;
  }
};

const createRoom = async (userId, title) => {
  try {
    const roomId = uuidv4();
    const chatId = uuidv4();
    const code = await generateUniqueCode();
    const profileNum = 1;

    await conn.query(roomQueries.createRoom, [roomId, title, code]);
    await conn.query(chatQueries.createChat, [chatId, roomId]);
    await conn.query(memberQueries.createMember, [userId, roomId, profileNum]);

    return { message: "스터디 생성 성공", roomId };
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
      JSON.stringify(notice),
      roomId,
    ]);

    if (noticeResult.affectedRows === 0) {
      throw new CustomError("공지 수정 실패", StatusCodes.BAD_REQUEST);
    }

    return { message: "공지 수정 성공" };
  } catch (err) {
    throw err;
  }
};

const getRoom = async (roomId, userId) => {
  const [[roomResult]] = await conn.query(roomQueries.getRoomById, roomId);
  const { members } = await getMembersRecord(roomId);
  const { date, time } = await getAttendanceDate(userId, roomId);
  const { records: attendanceRecord } = await getUserAttendances(
    userId,
    roomId
  );
  const { schedules } = await getSchedule(roomId);

  return {
    message: "스터디 조회 성공",
    ...roomResult,
    notice: JSON.parse(roomResult.notice) || [],
    members,
    nextAttendance: { date, time },
    attendanceRecord,
    schedules,
  };
};

module.exports = {
  checkRoom,
  createRoom,
  getRooms,
  updateNotice,
  getRoom,
};
