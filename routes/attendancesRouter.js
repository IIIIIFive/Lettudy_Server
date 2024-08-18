const express = require("express");
const attendanceRouter = express.Router();
const { verifyToken, authorizeUser } = require("../middlewares/auth");
const {
  updateAttendanceStatus,
  getUserAttendances,
} = require("../controllers/attendancesController");

attendanceRouter.put(
  "/:roomId",
  verifyToken,
  authorizeUser,
  updateAttendanceStatus
);

attendanceRouter.get(
  "/:roomId",
  verifyToken,
  authorizeUser,
  getUserAttendances
);

module.exports = attendanceRouter;
