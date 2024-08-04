const conn = require("../utils/db");
const memberQueries = require("../queries/memberQueries");
const roomQueries = require("../queries/roomQueries");
const roomService = require("./roomService");

const createMember = async (userId, code) => {
  try {
    const room = await roomService.getRoomByCode(code);
    const count = await checkMember(userId, room.roomId);
    if (count != 0) {
      throw new Error("이미 가입된 스터디입니다.");
    }

    if (room.member_count >= 8) {
      throw new Error("제한 인원을 초과하여 가입할 수 없는 스터디입니다.");
    }

    const values = [userId, room.roomId, room.member_count + 1];

    await conn.query(memberQueries.createMember, values);
    await conn.query(roomQueries.updateRoomMemberCount, room.roomId);

    return room.member_count + 1;
  } catch (err) {
    throw err;
  }
};

const checkMember = async (userId, roomId) => {
  const [[{ count }]] = await conn.query(memberQueries.checkMember, [
    roomId,
    userId,
  ]);

  return count;
};

module.exports = {
  createMember,
  checkMember,
};
