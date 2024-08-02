const conn = require("../utils/db");
const roomQueries = require("../queries/roomQueries");
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

const checkMember = async (userId, roomId) => {
  const [[{ id: memberId, count }]] = await conn.query(
    roomQueries.checkMember,
    [roomId, userId]
  );

  return { memberId, count };
};

const createRoom = async (userId, title) => {
  try {
    const roomId = uuidv4();
    const code = await generateUniqueCode();

    const values = [roomId, userId, title, code];

    await conn.query(roomQueries.createRoom, values);

    return { roomId, code };
  } catch (err) {
    throw err;
  }
};

const createMember = async (userId, code) => {
  try {
    const room = await getRoomByCode(code);
    const { count } = await checkMember(userId, room.roomId);
    if (count != 0) {
      throw new Error("이미 가입된 스터디입니다.");
    }

    if (room.member_count >= 8) {
      throw new Error("제한 인원을 초과하여 가입할 수 없는 스터디입니다.");
    }

    const memberId = uuidv4();
    const values = [memberId, userId, room.roomId, room.member_count + 1];

    await conn.query(roomQueries.createMember, values);
    await conn.query(roomQueries.updateRoomMemberCount, room.roomId);

    return { memberId, profileNum: room.member_count + 1 };
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
      notice: room.notice,
      memberId: room.member_id,
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
  checkMember,
  createRoom,
  createMember,
  getRoomByCode,
  getRooms,
  updateNotice,
};
