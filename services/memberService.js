const conn = require("../utils/db");
const CustomError = require("../utils/CustomError");
const { StatusCodes } = require("http-status-codes");
const memberQueries = require("../queries/memberQueries");
const scheduleQueries = require("../queries/scheduleQueries");
const attendanceQueries = require("../queries/attendanceQueries");
const roomQueries = require("../queries/roomQueries");

const getProfileNum = async (roomId) => {
  const [profileResult] = await conn.query(
    memberQueries.getMembersProfiles,
    roomId
  );
  const usedProfileNum = profileResult.map((profile) => profile.profile_num);

  let profileNum;
  for (let i = 1; i <= 6; i++) {
    if (!usedProfileNum.includes(i)) {
      profileNum = i;
      break;
    }
  }

  return profileNum;
};

const deleteRoom = async (roomId) => {
  try {
    await conn.query(roomQueries.deleteRoom, roomId);
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

    return room;
  } catch (err) {
    throw err;
  }
};

const createMember = async (userId, code) => {
  try {
    const room = await getRoomByCode(code);
    const count = await checkMember(userId, room.roomId);
    const [[{ memberCount }]] = await conn.query(
      memberQueries.getMembersCount,
      room.roomId
    );
    if (count != 0) {
      throw new CustomError(
        "이미 가입된 스터디입니다.",
        StatusCodes.BAD_REQUEST
      );
    }

    if (memberCount >= 6) {
      throw new CustomError(
        "제한 인원을 초과하여 가입할 수 없는 스터디입니다.",
        StatusCodes.FORBIDDEN
      );
    }
    const profileNum = await getProfileNum(room.roomId);
    const values = [userId, room.roomId, profileNum];

    const [memberResult] = await conn.query(memberQueries.createMember, values);

    if (memberResult.affectedRows === 0) {
      throw new CustomError("스터디 가입 실패", StatusCodes.BAD_REQUEST);
    }

    return {
      message: "스터디 가입 성공",
      roomId: room.roomId,
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
          profileNum: member.profile_num,
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

    // 출석 데이터 삭제
    // member와 attendance가 외래키로 연결되어 있지 않아서 직접 삭제 필요
    await conn.query(attendanceQueries.deleteMemberAttendances, [
      userId,
      roomId,
    ]);

    const [[{ memberCount }]] = await conn.query(
      memberQueries.getMembersCount,
      roomId
    );

    if (memberCount === 0) {
      await deleteRoom(roomId);
    }

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
