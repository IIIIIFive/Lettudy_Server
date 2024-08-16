const { StatusCodes } = require("http-status-codes");
const attendanceService = require("../services/attendanceService");
const CustomError = require("../utils/CustomError");

const updateAttendanceStatus = async (req, res) => {
  try {
    const userId = req.userId;
    const { attendanceId } = req.body;
    if (!attendanceId) {
      throw new CustomError("출석 id가 필요합니다", StatusCodes.BAD_REQUEST);
    }
    const result = await attendanceService.updateAttendanceStatus(
      userId,
      attendanceId
    );

    res.status(StatusCodes.OK).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

const getUserAttendances = async (req, res) => {
  try {
    const userId = req.userId;
    const roomId = req.roomId;
    const result = await attendanceService.getUserAttendances(userId, roomId);

    res.status(StatusCodes.OK).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

module.exports = {
  updateAttendanceStatus,
  getUserAttendances,
};
