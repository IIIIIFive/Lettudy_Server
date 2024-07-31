const conn = require("../utils/db");
const roomQueries = require("../queries/roomQueries");
const { v4: uuidv4 } = require("uuid");
const { createCode } = require("../utils/hashedpw");

const checkCodeUnique = async (code) => {
  const [[result]] = await conn.query(roomQueries.checkCode, code);
  return result.count === 0;
};

const checkMember = async (userId, code) => {
  const [[result]] = await conn.query(roomQueries.checkMember, [userId, code]);
  console.log(result);
  return result.count !== 0;
};

const createRoom = async (userId, title) => {
  try {
    const roomId = uuidv4();

    let roomCode = createCode();
    let isUnique = await checkCodeUnique(roomCode);

    while (!isUnique) {
      roomCode = createCode();
      isUnique = await checkCodeUnique(roomCode);
    }

    const values = [roomId, userId, title, roomCode];

    await conn.query(roomQueries.createRoom, values);

    return roomCode;
  } catch (err) {
    throw err;
  }
};

const createMember = async (userId, roomCode) => {
  try {
    const room = await getRoomByCode(roomCode);
    const isAlreadyMember = await checkMember(userId, roomCode);
    if (isAlreadyMember) {
      throw new Error("이미 가입된 스터디입니다.");
    }

    if (room.member_count == 8) {
      throw new Error("제한 인원을 초과하여 가입할 수 없는 스터디입니다.");
    }

    const memberId = uuidv4();

    const values = [memberId, userId, room.id];

    await conn.query(roomQueries.createMember, values);
    await conn.query(roomQueries.updateRoom, roomCode);
  } catch (err) {
    throw err;
  }
};

const getRoomByCode = async (roomCode) => {
  try {
    const [[room]] = await conn.query(roomQueries.getRoomByCode, roomCode);
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
      code: room.code,
      title: room.title,
      createdAt: room.created_at,
    }));
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createRoom,
  createMember,
  getRoomByCode,
  getRooms,
};
