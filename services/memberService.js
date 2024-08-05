const conn = require("../utils/db");
const memberQueries = require("../queries/memberQueries");
const roomQueries = require("../queries/roomQueries");
const roomService = require("./roomService");
const CustomError = require("../utils/CustomError");
const { StatusCodes } = require("http-status-codes");
const scheduleQueries = require("../queries/scheduleQueries");

const createMember = async (userId, code) => {
  try {
    const room = await roomService.getRoomByCode(code);
    const count = await checkMember(userId, room.roomId);
    if (count != 0) {
      throw new CustomError(
        "이미 가입된 스터디입니다.",
        StatusCodes.BAD_REQUEST
      );
    }

    if (room.member_count >= 8) {
      throw new CustomError(
        "제한 인원을 초과하여 가입할 수 없는 스터디입니다.",
        StatusCodes.FORBIDDEN
      );
    }

    const values = [userId, room.roomId, room.member_count + 1];

    const [memberResult] = await conn.query(memberQueries.createMember, values);
    if (memberResult.affectedRows === 0) {
      throw new CustomError("스터디 가입 실패", StatusCodes.BAD_REQUEST);
    }

    await conn.query(roomQueries.updateRoomMemberCount, room.roomId);

    return {
      profileNum: room.member_count + 1,
    };
  } catch (err) {
    throw err;
  }
};

const checkMember = async (userId, roomId) => {
  try {
    const [[{ count }]] = await conn.query(memberQueries.checkMember, [
      roomId,
      userId,
    ]);

    return count;
  } catch (err) {
    throw err;
  }
};

const getMembersRecord = async (roomId) => {
  try {
    const [[{ totalCount }]] = await conn.query(
      scheduleQueries.getTotalAttendances,
      roomId
    );

    if (totalCount === 0) {
      const [memberResult] = await conn.query(
        memberQueries.getMembersName,
        roomId
      );

      return {
        members: memberResult.map((member) => ({
          name: member.name,
          attendanceRate: 100,
        })),
      };
    }

    const [memberResult] = await conn.query(
      memberQueries.getMembersAttendanceCount,
      [roomId]
    );

    return {
      members: memberResult.map((member) => ({
        name: member.name,
        attendanceRate: Math.round((member.count * 100) / totalCount),
      })),
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createMember,
  checkMember,
  getMembersRecord,
};
