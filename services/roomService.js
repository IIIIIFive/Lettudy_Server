const conn = require("../utils/db");
const roomQueries = require("../queries/roomQueries");
const { v4: uuidv4 } = require("uuid");
const { createCode } = require("../utils/hashedpw");

const generateUniqueId = async () => {
  let id;
  let isUnique = false;

  while (!isUnique) {
    id = createCode();
    const [[result]] = await conn.query(roomQueries.checkId, id);
    isUnique = result.count === 0;
  }
  return id;
};

const checkMember = async (userId, roomId) => {
  const [[result]] = await conn.query(roomQueries.checkMember, [
    roomId,
    userId,
  ]);

  return result.count !== 0;
};

const createRoom = async (userId, title) => {
  try {
    let roomId = await generateUniqueId();

    const values = [roomId, userId, title];

    await conn.query(roomQueries.createRoom, values);

    return roomId;
  } catch (err) {
    throw err;
  }
};

const createMember = async (userId, roomId) => {
  try {
    const room = await getRoomById(roomId);
    const isAlreadyMember = await checkMember(userId, roomId);

    if (isAlreadyMember) {
      throw new Error("이미 가입된 스터디입니다.");
    }

    if (room.member_count == 8) {
      throw new Error("제한 인원을 초과하여 가입할 수 없는 스터디입니다.");
    }

    const memberId = uuidv4();

    const values = [memberId, userId, room.id];

    await conn.query(roomQueries.createMember, values);
    await conn.query(roomQueries.updateRoomMemberCount, roomId);
  } catch (err) {
    throw err;
  }
};

const getRoomById = async (roomId) => {
  try {
    const [[room]] = await conn.query(roomQueries.getRoomById, roomId);
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
      id: room.id,
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
  getRoomById,
  getRooms,
};
