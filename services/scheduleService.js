const conn = require("../utils/db");
const scheduleQueries = require("../queries/scheduleQueries");
const { v4: uuidv4 } = require("uuid");
const CustomError = require("../utils/CustomError");
const { StatusCodes } = require("http-status-codes");

const createSchedule = async (
  userId,
  roomId,
  title,
  date,
  time,
  isAttendance
) => {
  try {
    const userResult = await conn.query(
      scheduleQueries.getMemberByUserIdRoomId,
      [userId, roomId]
    );
    const userRoom = userResult[0][0];

    if (!userRoom) {
      throw new CustomError(
        "해당 스터디에 가입되어 있지 않은 회원입니다.",
        StatusCodes.FORBIDDEN
      );
    }

    const scheduleId = uuidv4();
    const dateTime = new Date(`${date}T${time}`); // 날짜 + 시간
    const values = [scheduleId, roomId, title, dateTime, isAttendance];

    await conn.query(scheduleQueries.createSchedule, values);

    return {
      message: "일정 등록 성공",
      schedule: {
        scheduleId,
        roomId,
        title,
        date,
        time,
        isAttendance,
      },
    };
  } catch (err) {
    throw err;
  }
};

const deleteSchedule = async (userId, roomId, scheduleId) => {
  try {
    // 스터디방 멤버 여부 확인
    const userResult = await conn.query(
      scheduleQueries.getMemberByUserIdRoomId,
      [userId, roomId]
    );
    const userRoom = userResult[0][0];

    if (!userRoom) {
      throw new CustomError(
        "해당 스터디에 가입되어 있지 않은 회원입니다.",
        StatusCodes.FORBIDDEN
      );
    }

    const deleteResult = await conn.query(scheduleQueries.deleteSchedule, [
      scheduleId,
      userId,
    ]);
    // 존재하지 않는 일정 처리
    if (deleteResult[0].affectedRows === 0) {
      throw new CustomError("일정을 찾을 수 없습니다.", StatusCodes.NOT_FOUND);
    }

    return {
      message: "일정 삭제 성공",
    };
  } catch (err) {
    throw err;
  }
};

const getSchedule = async (userId, roomId) => {
  try {
    // 스터디방 멤버 여부 확인
    const userResult = await conn.query(
      scheduleQueries.getMemberByUserIdRoomId,
      [userId, roomId]
    );
    const userRoom = userResult[0][0];

    if (!userRoom) {
      throw new CustomError(
        "해당 스터디에 가입되어 있지 않은 회원입니다.",
        StatusCodes.FORBIDDEN
      );
    }

    const schedulesResult = await conn.query(
      scheduleQueries.getSchedulesByRoomId,
      [roomId]
    );
    const schedules = schedulesResult[0];

    return {
      message: "일정 조회 성공",
      schedule: schedules,
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createSchedule,
  deleteSchedule,
  getSchedule,
};
