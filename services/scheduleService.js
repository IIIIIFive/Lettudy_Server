const conn = require("../utils/db");
const { v4: uuidv4 } = require("uuid");
const schedule = require("node-schedule");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../utils/CustomError");
const scheduleQueries = require("../queries/scheduleQueries");
const memberQueries = require("../queries/memberQueries");
const { createAttendance, deleteAttendances } = require("./attendanceService");
const { sendPushNotification } = require("../utils/cloudMessaging");

const createAttendanceAlarm = (
  userToken,
  attendanceDate,
  roomTitle,
  scheduleTitle
) => {
  const reminderTime = new Date(attendanceDate - 10 * 60 * 1000);
  const messageTitle = `${roomTitle} 출석 안내`;
  const messageBody = `${scheduleTitle} 일정이 10분 전입니다.`;
  schedule.scheduleJob(reminderTime, () => {
    sendPushNotification(userToken, messageTitle, messageBody);
  });
};

const createSchedule = async (roomId, title, date, time, isAttendance) => {
  try {
    const scheduleId = uuidv4();
    const dateTime = new Date(`${date}T${time}`); // 날짜 + 시간
    const values = [scheduleId, roomId, title, dateTime, isAttendance];

    await conn.query(scheduleQueries.createSchedule, values);

    if (isAttendance) {
      const [memberResult] = await conn.query(memberQueries.getMembers, roomId);

      memberResult.forEach((member) => {
        if (member.alarm && member.fcm_token) {
          createAttendanceAlarm(
            member.fcm_token,
            dateTime,
            member.room_title,
            title
          );
        }
      });

      const memberIds = memberResult.map((member) => member.user_id);
      const [attendanceResult] = await createAttendance(scheduleId, memberIds);

      if (attendanceResult.affectedRows === 0) {
        throw new CustomError(
          "출석부 등록에 실패했습니다.",
          StatusCodes.BAD_REQUEST
        );
      }
    }

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
    const [[scheduleResult]] = await conn.query(
      scheduleQueries.getSchedule,
      scheduleId
    );

    // 존재하지 않는 일정 처리
    if (!scheduleResult) {
      throw new CustomError("일정을 찾을 수 없습니다.", StatusCodes.NOT_FOUND);
    }

    const isAttendance = scheduleResult.is_attendance;
    if (isAttendance) {
      const [attendanceResult] = await deleteAttendances(scheduleId);

      if (attendanceResult.affectedRows === 0) {
        throw new CustomError(
          "출석부 삭제에 실패했습니다.",
          StatusCodes.BAD_REQUEST
        );
      }
    }

    const [deleteResult] = await conn.query(scheduleQueries.deleteSchedule, [
      scheduleId,
      userId,
    ]);

    if (deleteResult.affectedRows === 0) {
      throw new CustomError(
        "일정 삭제에 실패했습니다.",
        StatusCodes.BAD_REQUEST
      );
    }

    return {
      message: "일정 삭제 성공",
    };
  } catch (err) {
    throw err;
  }
};

const getSchedule = async (roomId) => {
  try {
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

const getAttendanceDate = async (userId, roomId) => {
  try {
    const [[attendanceResult]] = await conn.query(
      scheduleQueries.getAttendanceDate,
      [roomId, userId]
    );

    if (!attendanceResult) {
      return {
        message: "출석 일정이 없습니다.",
      };
    }

    return {
      message: "출석 날짜 조회 성공",
      attendanceId: attendanceResult.attendanceId,
      title: attendanceResult.title,
      date: attendanceResult.date.split(" ")[0],
      time: attendanceResult.date.split(" ")[1],
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createSchedule,
  deleteSchedule,
  getSchedule,
  getAttendanceDate,
};
