const conn = require("../utils/db");
const memberQueries = require("../queries/memberQueries");
const scheduleQueries = require("../queries/scheduleQueries");

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
      message: "멤버 출석률 조회 성공",
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
  checkMember,
  getMembersRecord,
};
