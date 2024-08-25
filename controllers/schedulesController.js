const { StatusCodes } = require("http-status-codes");
const scheduleService = require("../services/scheduleService");

const createSchedule = async (req, res) => {
  try {
    const roomId = req.roomId;
    const { title, date, time, isAttendance } = req.body;

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

const deleteSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const result = await scheduleService.deleteSchedule(scheduleId);

    res.status(StatusCodes.OK).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

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
