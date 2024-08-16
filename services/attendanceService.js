const conn = require("../utils/db");
const attendanceQueries = require("../queries/attendanceQueries");
const { v4: uuidv4 } = require("uuid");
const CustomError = require("../utils/CustomError");
const { StatusCodes } = require("http-status-codes");

const createAttendance = async (scheduleId, members) => {
  try {
    const attendanceIds = [];
    const values = members.map((memberId) => {
      const id = uuidv4();
      attendanceIds.push(id);
      return [id, scheduleId, memberId, false];
    });

    const [attendanceResult] = await conn.query(
      attendanceQueries.createAttendances,
      [values]
    );

    return {
      attendanceIds,
      attendanceResult,
    };
  } catch (err) {
    throw err;
  }
};

const deleteAttendances = async (scheduleId) => {
  try {
    return await conn.query(attendanceQueries.deleteAttendances, scheduleId);
  } catch (err) {
    throw err;
  }
};

const updateAttendanceStatus = async (userId, attendanceId) => {
  try {
    const [updateResult] = await conn.query(
      attendanceQueries.updateAttendanceStatus,
      [attendanceId, userId]
    );

    if (updateResult.affectedRows === 0) {
      throw new CustomError(
        "존재하지 않는 일정입니다.",
        StatusCodes.BAD_REQUEST
      );
    }

    return {
      message: "출석 성공",
    };
  } catch (err) {
    throw err;
  }
};

const getUserAttendances = async (userId, roomId) => {
  try {
    const [attendanceResult] = await conn.query(
      attendanceQueries.getUserAttendances,
      [userId, roomId]
    );

    const records = attendanceResult.map((record) => ({
      date: record.date.split(" ")[0],
      time: record.date.split(" ")[1],
      status: record.status,
    }));

    return {
      message: "출석 조회 성공",
      records,
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createAttendance,
  deleteAttendances,
  updateAttendanceStatus,
  getUserAttendances,
};
