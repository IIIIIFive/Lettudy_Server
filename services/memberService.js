const conn = require("../utils/db");
const memberQueries = require("../queries/memberQueries");
const scheduleQueries = require("../queries/scheduleQueries");
const roomQueries = require("../queries/roomQueries");
const { getRoomByCode } = require("./roomService");
const attendanceQueries = require("../queries/attendanceQueries");
const CustomError = require("../utils/CustomError");
const { StatusCodes } = require("http-status-codes");

const createMember = async (userId, code) => {
  try {
    const room = await getRoomByCode(code);
    const count = await checkMember(userId, room.roomId);
    if (count != 0) {
      throw new CustomError(
        "이미 가입된 스터디입니다.",
        StatusCodes.BAD_REQUEST
      );
    }

    if (room.memberCount >= 6) {
      throw new CustomError(
        "제한 인원을 초과하여 가입할 수 없는 스터디입니다.",
        StatusCodes.FORBIDDEN
      );
    }

    const [profileResult] = await conn.query(
      memberQueries.getProfiles,
      room.roomId
    );
    const usedProfileNum = profileResult.map((profile) => profile.profile_num);

    let profileNum;
    for (let i = 1; i <= 6; i++) {
      if (!usedProfileNum.includes(i)) {
        profileNum = i;
        break;
      }
    }

    const values = [userId, room.roomId, profileNum];

    const [memberResult] = await conn.query(memberQueries.createMember, values);

    if (memberResult.affectedRows === 0) {
      throw new CustomError("스터디 가입 실패", StatusCodes.BAD_REQUEST);
    }

    await conn.query(roomQueries.increaseRoomMemberCount, room.roomId);

    return {
      message: "스터디 가입 성공",
      profileNum,
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
      message: "멤버 출석률 조회 성공",
      members: memberResult.map((member) => ({
        name: member.name,
        profileNum: member.profile_num,
        attendanceRate: Math.round((member.count * 100) / totalCount),
      })),
    };
  } catch (err) {
    throw err;
  }
};

const deleteMember = async (userId, roomId) => {
  try {
    const [deleteMemberResult] = await conn.query(memberQueries.deleteMember, [
      userId,
      roomId,
    ]);

    if (deleteMemberResult.affectedRows === 0) {
      throw new CustomError("스터디 나가기 실패", StatusCodes.BAD_REQUEST);
    }

    await conn.query(attendanceQueries.deleteMemberAttendances, [
      userId,
      roomId,
    ]);

    await conn.query(roomQueries.decreaseRoomMembercount, roomId);

    return {
      message: "스터디 나가기 성공",
    };
  } catch (err) {
    throw err;
  }
};

const updateAlarm = async (userId, roomId, alarm) => {
  try {
    const [updateAlarmResult] = await conn.query(memberQueries.updateAlarm, [
      alarm,
      userId,
      roomId,
    ]);

    if (updateAlarmResult.affectedRows === 0) {
      throw new CustomError("알람 변경 실패", StatusCodes.BAD_REQUEST);
    }

    return {
      messsage: "알람 변경 성공",
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createMember,
  checkMember,
  getMembersRecord,
  deleteMember,
  updateAlarm,
};
