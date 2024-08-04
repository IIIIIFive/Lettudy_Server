const conn = require("../utils/db");
const roomQueries = require("../queries/roomQueries");
const chatQueries = require("../queries/chatQueries");
const { v4: uuidv4 } = require("uuid");
const { createCode } = require("../utils/hashedpw");

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

    const values = [roomId, userId, title, code];
    await conn.query(roomQueries.createRoom, values);
    await conn.query(chatQueries.createChat, [chatId, roomId]);

    return { roomId, code };
  } catch (err) {
    throw err;
  }
};

const getRoomByCode = async (code) => {
  try {
    const [[{ id }]] = await conn.query(roomQueries.getIdByCode, code);
    const [[room]] = await conn.query(roomQueries.getRoomById, id);
    if (!room) {
      throw new Error("존재하지 않는 스터디입니다.");
    }
    return room;
  } catch (err) {
    throw err;
  }
};

const getRooms = async (userId) => {
  try {
    const [rooms] = await conn.query(roomQueries.getRooms, userId);

    return rooms.map((room) => ({
      roomId: room.id,
      title: room.title,
      code: room.code,
      notice: room.notice || "",
      profileNum: room.profile_num,
      alarm: room.alarm,
      createdAt: room.created_at,
      joinedAt: room.joined_at,
    }));
  } catch (err) {
    throw err;
  }
};

const updateNotice = async (roomId, notice) => {
  try {
    await conn.query(roomQueries.updateNotice, [notice, roomId]);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createRoom,
  getRoomByCode,
  getRooms,
  updateNotice,
};
