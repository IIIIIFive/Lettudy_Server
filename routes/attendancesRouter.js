const express = require("express");
const attendanceRouter = express.Router();
const { verifyToken, authorizeUser } = require("../middlewares/auth");
const {
  updateAttendanceStatus,
  getUserAttendances,
} = require("../controllers/attendancesController");
const { validate } = require("../middlewares/validator");

attendanceRouter.put(
  "/:roomId",
  validate([]),
  verifyToken,
  authorizeUser,
  updateAttendanceStatus
);

attendanceRouter.get(
  "/:roomId",
  validate([]),
  verifyToken,
  authorizeUser,
  getUserAttendances
);

module.exports = attendanceRouter;
