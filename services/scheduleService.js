const conn = require("../utils/db");
const scheduleQueries = require("../queries/scheduleQueries");
const { v4: uuidv4 } = require("uuid");

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
      throw new Error("해당 스터디에 가입되어 있지 않은 회원입니다.");
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

const deleteSchedule = async (userId, scheduleId) => {
  try {
    await conn.query(scheduleQueries.deleteSchedule, [scheduleId, userId]);

    return {
      message: "일정 삭제 성공",
    };
  } catch (err) {
    throw err;
  }
};

const getSchedule = async (userId, scheduleId) => {
  try {
    const schedule = await conn.query(scheduleQueries.getSchedule, [
      scheduleId,
      userId,
    ]);
    const scheduleData = schedule[0][0];

    if (!scheduleData) {
      throw new Error("일정을 찾을 수 없습니다");
    }

    return {
      message: "일정 조회 성공",
      schedule: scheduleData,
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
