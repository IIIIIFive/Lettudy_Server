const conn = require("../utils/db");
const { v4: uuidv4 } = require("uuid");
const schedule = require("node-schedule");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../utils/CustomError");
const scheduleQueries = require("../queries/scheduleQueries");
const memberQueries = require("../queries/memberQueries");
const { createAttendance } = require("./attendanceService");
const { sendPushNotification } = require("../utils/cloudMessaging");
const attendanceQueries = require("../queries/attendanceQueries");

const verifyAlarmSchedule = async (attendanceId, userId, roomId) => {
  const [[{ count }]] = await conn.query(
    attendanceQueries.getAttendance,
    attendanceId
  );

  if (count === 0) return false;

  const [[{ alarm, fcmToken }]] = await conn.query(memberQueries.getAlarmInfo, [
    userId,
    roomId,
  ]);

  if (!alarm || !fcmToken) return false;

  return fcmToken;
};

const createAttendanceAlarm = async (
  attendanceId,
  userId,
  roomId,
  alarmInfo
) => {
  const reminderTime = new Date(alarmInfo.attendanceDate - 10 * 60 * 1000);
  const messageTitle = `${alarmInfo.roomTitle} 출석 안내`;
  const messageBody = `${alarmInfo.scheduleTitle} 일정이 10분 전입니다.`;
  schedule.scheduleJob(reminderTime, async () => {
    const userToken = await verifyAlarmSchedule(attendanceId, userId, roomId);
    if (userToken) {
      sendPushNotification(userToken, messageTitle, messageBody);
    }
  });
};

const createMembersAttendance = async (scheduleId, roomId, title, dateTime) => {
  const [memberResult] = await conn.query(memberQueries.getMembers, roomId);

  const memberIds = memberResult.map((member) => member.user_id);
  const { attendanceResult, attendanceIds } = await createAttendance(
    scheduleId,
    memberIds
  );

  const members = memberResult.map((member, idx) => ({
    ...member,
    attendanceId: attendanceIds[idx],
  }));

  for (let member of members) {
    const alarmInfo = {
      roomTitle: member.room_title,
      scheduleTitle: title,
      attendanceDate: dateTime,
    };

    await createAttendanceAlarm(
      member.attendanceId,
      member.user_id,
      roomId,
      alarmInfo
    );
  }

  if (attendanceResult.affectedRows === 0) {
    throw new CustomError("출석부 등록 실패", StatusCodes.BAD_REQUEST);
  }
};

const createSchedule = async (roomId, title, date, time, isAttendance) => {
  try {
    const scheduleId = uuidv4();
    const dateTime = new Date(`${date}T${time}`); // 날짜 + 시간
    const values = [scheduleId, roomId, title, dateTime, isAttendance];

    const [scheduleResult] = await conn.query(
      scheduleQueries.createSchedule,
      values
    );

    if (scheduleResult.affectedRows === 0) {
      throw new CustomError("일정 등록 실패", StatusCodes.BAD_REQUEST);
    }

    if (isAttendance) {
      await createMembersAttendance(scheduleId, roomId, title, dateTime);
    }

    return {
      message: "일정 등록 성공",
    };
  } catch (err) {
    throw err;
  }
};

const deleteSchedule = async (roomId, scheduleId) => {
  try {
    const [[scheduleResult]] = await conn.query(
      scheduleQueries.getSchedule,
      scheduleId
    );

    // 존재하지 않는 일정 처리
    if (!scheduleResult) {
      throw new CustomError("일정을 찾을 수 없습니다.", StatusCodes.NOT_FOUND);
    }

    const [deleteResult] = await conn.query(
      scheduleQueries.deleteSchedule,
      scheduleId
    );

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
    const [schedulesResult] = await conn.query(
      scheduleQueries.getSchedulesByRoomId,
      [roomId]
    );
    const schedules = schedulesResult.map((schedule) => ({
      scheduleId: schedule.id,
      title: schedule.title,
      date: schedule.date.split(" ")[0],
      time: schedule.date.split(" ")[1],
      isAttendance: schedule.is_attendance === 1,
    }));

    return {
      message: "일정 조회 성공",
      schedules,
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
  createAttendanceAlarm,
};
