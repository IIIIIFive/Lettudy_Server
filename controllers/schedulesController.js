const scheduleService = require("../services/scheduleService");
const { StatusCodes } = require("http-status-codes");

// 일정 등록
const createSchedule = async (req, res) => {
  try {
    const userId = req.userId;
    const { roomId } = req.params;
    const { title, date, time, isAttendance } = req.body;

    const result = await scheduleService.createSchedule(
      userId,
      roomId,
      title,
      date,
      time,
      isAttendance
    );

    res.status(StatusCodes.CREATED).json(result);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
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
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

// 일정 조회
const getSchedule = async (req, res) => {
  try {
    const userId = req.userId;
    const { scheduleId } = req.params;
    const result = await scheduleService.getSchedule(userId, scheduleId);

    res.status(StatusCodes.OK).json(result);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

module.exports = {
  createSchedule,
  deleteSchedule,
  getSchedule,
};
