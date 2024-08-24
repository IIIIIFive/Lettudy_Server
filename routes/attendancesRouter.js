const express = require("express");
const attendanceRouter = express.Router();
const { verifyToken, authorizeUser } = require("../middlewares/auth");
const {
  updateAttendanceStatus,
  getUserAttendances,
} = require("../controllers/attendancesController");
const { validate } = require("../middlewares/validator");
const {
  createIdChain: createIdParamChain,
} = require("../utils/paramValidations");
const {
  createIdChain: createIdBodyChain,
} = require("../utils/bodyValidations");

attendanceRouter.put(
  "/:roomId",
  validate([
    createIdParamChain("roomId", 36),
    createIdBodyChain("attendanceId"),
  ]),
  verifyToken,
  authorizeUser,
  updateAttendanceStatus
);

attendanceRouter.get(
  "/:roomId",
  validate([createIdParamChain("roomId", 36)]),
  verifyToken,
  authorizeUser,
  getUserAttendances
);

module.exports = attendanceRouter;
