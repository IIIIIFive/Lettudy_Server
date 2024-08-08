const scheduleService = require("../services/scheduleService");
const { StatusCodes } = require("http-status-codes");

// 일정 등록
const createSchedule = async (req, res) => {
  try {
    const roomId = req.roomId;
    const { title, date, time, isAttendance } = req.body;

    if (!title || !date || !time || !isAttendance) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "요청값을 확인해주세요",
      });
    }

    const result = await scheduleService.createSchedule(
      roomId,
      title,
      date,
      time,
      isAttendance
    );

    res.status(StatusCodes.CREATED).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

// 일정 삭제
const deleteSchedule = async (req, res) => {
  try {
    const userId = req.userId;

    const { scheduleId } = req.params;
    const result = await scheduleService.deleteSchedule(userId, scheduleId);

    res.status(StatusCodes.OK).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

// 일정 조회
const getSchedule = async (req, res) => {
  try {
    const userId = req.userId;
    const roomId = req.roomId;
    const { isAttendance } = req.query;

    let result;
    if (isAttendance) {
      result = await scheduleService.getAttendanceDate(userId, roomId);
    } else {
      result = await scheduleService.getSchedule(roomId);
    }

    res.status(StatusCodes.OK).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

module.exports = {
  createSchedule,
  deleteSchedule,
  getSchedule,
};
