const { StatusCodes } = require("http-status-codes");
const attendanceService = require("../services/attendanceService");

const updateAttendanceStatus = async (req, res) => {
  try {
    const userId = req.userId;
    const { attendanceId } = req.body;

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
